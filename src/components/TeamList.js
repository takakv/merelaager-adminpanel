/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import {
  addMember,
  fetchTeams,
  getTeams,
  removeMember,
} from "../features/teams/teamerSlice";
import { makePostRequest } from "./Common/requestAPI";
import { selectCurrentShift } from "../features/userAuth/userAuthSlice";

const TeamPlace = (props) => {
  const { team, teamCount } = props;

  const updatePlace = async ({ target }) => {
    if (!target.value) return;
    if (target.value < 1 || target.value > teamCount) {
      alert(`Kohad peavad olema 1–${teamCount}`);
      return;
    }
    await makePostRequest("teams/set/place/", {
      teamId: team.id,
      place: target.value,
    });
  };

  return (
    <input
      type="number"
      min={1}
      max={teamCount}
      onBlur={updatePlace}
      defaultValue={team.place}
    />
  );
};

TeamPlace.propTypes = {
  teamCount: PropTypes.number.isRequired,
  team: PropTypes.objectOf(PropTypes.any).isRequired,
};

const Leaderboard = () => {
  const { teams } = useSelector(getTeams);
  const teamCount = Object.keys(teams).length;

  return (
    <div className="c-leaderboard u-flex u-flex-wrap">
      <p className="c-leaderboard-title">Kohad:</p>
      {Object.values(teams).map((team) => (
        <div className="c-leaderboard-item" key={team.id}>
          <div className="c-leaderboard-team">{team.name}</div>
          <div className="c-leaderboard-place">
            <TeamPlace team={team} teamCount={teamCount} />
          </div>
        </div>
      ))}
    </div>
  );
};

const TeamsPage = (props) => {
  const { title } = props;
  const shiftNr = useSelector(selectCurrentShift);
  const dispatch = useDispatch();
  dispatch(setTitle(title));

  // Get the teams.
  useSelector(getTeams);
  const teamsStatus = useSelector((state) => state.teams.status);
  const teamsError = useSelector((state) => state.teams.error);

  useEffect(() => {
    if (teamsStatus === "idle") dispatch(fetchTeams(shiftNr));
  }, [teamsStatus, dispatch]);

  if (teamsStatus === "ok") {
    return (
      <div>
        <TeamCreator shiftNr={shiftNr} />
        <Leaderboard shiftNr={shiftNr} />
        <TeamlessList />
        <TeamsList />
      </div>
    );
  }
  if (teamsStatus === "nok") {
    return (
      <div>
        <TeamCreator shiftNr={shiftNr} />
        <p>{teamsError}</p>
      </div>
    );
  }
  return (
    <div>
      <TeamCreator shiftNr={shiftNr} />
      <p>Laen...</p>
    </div>
  );
};

TeamsPage.propTypes = {
  title: PropTypes.string.isRequired,
};

const TeamCreator = () => {
  const [teamName, setTeamName] = useState();

  const handleChange = (event) => {
    setTeamName(event.target.value);
  };

  const createTeam = async ({ shiftNr }) => {
    const response = await makePostRequest("/teams/create/", {
      shiftNr,
      name: teamName,
    });
    if (!response || !response.ok) return;
    window.location.reload();
  };

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        Meeskonna nimi:
        <input type="text" onChange={handleChange} />
      </label>
      <button type="button" onClick={createTeam}>
        Loo meeskond
      </button>
    </div>
  );
};

const Teamless = (props) => {
  const { camper, teams } = props;
  const dispatch = useDispatch();

  const addCamperToTeam = async ({ target }) => {
    const response = await makePostRequest("teams/member/add/", {
      teamId: target.value,
      dataId: camper.id,
    });
    if (!response || !response.ok) return;

    dispatch(
      addMember({
        member: camper,
        teamId: target.value,
      })
    );
  };

  return (
    <div className="c-teamless">
      <p>{camper.name}</p>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        <select onChange={addCamperToTeam}>
          <option value={null} style={{ color: "grey" }}>
            Vali meeskond
          </option>
          {Object.values(teams).map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

Teamless.propTypes = {
  camper: PropTypes.objectOf(PropTypes.any).isRequired,
  teams: PropTypes.objectOf(PropTypes.object).isRequired,
};

const TeamlessList = () => {
  const data = useSelector(getTeams);
  const { teams, teamless } = data;

  return (
    <div className="u-flex u-flex-wrap">
      {teamless.map((camper) => (
        <Teamless key={camper.id} camper={camper} teams={teams} />
      ))}
    </div>
  );
};

const Member = (props) => {
  const { member, teamId } = props;

  const dispatch = useDispatch();
  const removeCamperFromTeam = async () => {
    const response = await makePostRequest("teams/member/remove/", {
      dataId: member.id,
    });
    if (!response || !response.ok) return;

    dispatch(
      removeMember({
        member,
        currentTeam: teamId,
      })
    );
  };

  return (
    <li className="u-flex u-space-between u-align-center">
      <span>{member.name}</span>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        role="button"
        className="c-team-rm"
        onClick={removeCamperFromTeam}
        tabIndex={0}
      >
        <div />
      </div>
    </li>
  );
};

Member.propTypes = {
  member: PropTypes.objectOf(PropTypes.any).isRequired,
  teamId: PropTypes.number.isRequired,
};

const TeamBox = (props) => {
  const { team } = props;
  return (
    <div className="c-team o-box">
      <div className="o-box-header u-text-center">
        <h3>{team.name}</h3>
        <p>{team.place ?? "-"}. koht</p>
        <p>{team.members.length} liiget</p>
      </div>
      <ul className="u-list-blank">
        {team.members.map((member) => (
          <Member key={member.id} member={member} teamId={team.id} />
        ))}
      </ul>
    </div>
  );
};

TeamBox.propTypes = {
  team: PropTypes.objectOf(PropTypes.any).isRequired,
};

const TeamsList = () => {
  const { teams } = useSelector(getTeams);

  return (
    <div className="u-flex u-flex-wrap">
      {Object.values(teams).map((team) => (
        <TeamBox key={team.id} team={team} />
      ))}
    </div>
  );
};

export default TeamsPage;
