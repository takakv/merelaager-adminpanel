/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { setTitle } from "../features/pageTitle/pageTitleSlice";
import {
  createTeam,
  deleteTeam,
  fetchTeams,
  selectTeams,
} from "../features/teams/teamerSlice";
import { makePostRequest } from "./Common/requestAPI";
import { selectCurrentShift } from "../features/userAuth/userAuthSlice";
import {
  fetchCamperInfo,
  selectAllCampersInfo,
  updateCamperInfo,
} from "../features/camperInfo/camperInfoSlice";

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
  const teams = useSelector(selectTeams);
  const teamCount = teams.length;

  console.log(teams);

  return (
    <div className="o-box c-leaderboard-box">
      <div className="o-box-header">
        <p>Kohad</p>
      </div>
      <div className="c-leaderboard-box__content">
        {teams.map((team) => (
          <div className="c-leaderboard-item" key={team.id}>
            <div className="c-leaderboard-team">{team.name}</div>
            <div className="c-leaderboard-place">
              <TeamPlace team={team} teamCount={teamCount} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamsPage = (props) => {
  const shiftNr = useSelector(selectCurrentShift);
  const dispatch = useDispatch();

  const { title } = props;
  useEffect(() => {
    dispatch(setTitle(title));
  }, [title, dispatch]);

  const camperStatus = useSelector((state) => state.camperInfo.status);
  const teamStatus = useSelector((state) => state.teams.status);

  const error = useSelector((state) => state.camperInfo.error);

  useEffect(() => {
    if (camperStatus === "idle") dispatch(fetchCamperInfo(shiftNr));
  }, [camperStatus, dispatch]);

  const year = new Date().getFullYear();
  useEffect(() => {
    if (teamStatus === "idle") dispatch(fetchTeams({ year, shiftNr }));
  }, [teamStatus, dispatch]);

  if (camperStatus === "ok" && teamStatus === "ok") {
    return (
      <div>
        <TeamCreator shiftNr={shiftNr} />
        <Leaderboard shiftNr={shiftNr} />
        <TeamlessList />
        <TeamsList />
      </div>
    );
  }
  if (camperStatus === "nok") {
    return (
      <div>
        <TeamCreator shiftNr={shiftNr} />
        <p>{error}</p>
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
  const dispatch = useDispatch();
  const shiftNr = useSelector(selectCurrentShift);

  const handleChange = (event) => {
    setTeamName(event.target.value);
  };

  const create = async () => {
    if (!teamName) return;
    dispatch(
      createTeam({
        year: new Date().getFullYear(),
        shiftNr,
        name: teamName,
      })
    );
  };

  return (
    <div className="o-infield">
      <div className="o-infield-input">
        <label htmlFor="teamname">Meeskonna nimi:</label>
        <input id="teamname" type="text" onChange={handleChange} />
      </div>
      <div className="o-infield-actions">
        <button className="o-button" type="button" onClick={create}>
          Loo meeskond
        </button>
      </div>
    </div>
  );
};

const Teamless = (props) => {
  const { camper } = props;
  const teams = useSelector(selectTeams);
  const dispatch = useDispatch();

  const addCamperToTeam = async ({ target }) => {
    const id = camper.childId;
    const field = "teamId";
    const reqObj = { id, field, data: {} };

    reqObj.data[field] = target.value;
    dispatch(updateCamperInfo(reqObj));
    console.log("Updated camper info");
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
          {teams.map((team) => (
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
};

const TeamlessList = () => {
  const data = useSelector(selectAllCampersInfo);

  const teamless = [];

  data.forEach((camper) => {
    if (!camper.teamId) teamless.push(camper);
  });

  return (
    <div className="u-flex u-flex-wrap">
      {teamless.map((camper) => (
        <Teamless key={camper.childId} camper={camper} />
      ))}
    </div>
  );
};

const Member = (props) => {
  const { member } = props;

  const dispatch = useDispatch();

  const removeCamperFromTeam = () => {
    const id = member.childId;
    const field = "teamId";
    const reqObj = { id, field, data: {} };

    reqObj.data[field] = null;
    dispatch(updateCamperInfo(reqObj));
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
};

const TeamBox = (props) => {
  const { team } = props;
  const dispatch = useDispatch();

  const campers = useSelector(selectAllCampersInfo);
  const teamMembers = campers.filter((camper) => camper.teamId === team.id);

  const removeTeam = () => {
    dispatch(deleteTeam(team.id));
  };

  return (
    <div className="c-team o-box">
      <div className="o-box-header u-text-center">
        <h3>{team.name}</h3>
        <p>{team.place ?? "-"}. koht</p>
        <p>{teamMembers.length} liiget</p>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/control-has-associated-label */}
        <div
          role="button"
          className="c-team-rm"
          onClick={removeTeam}
          tabIndex={0}
        />
      </div>
      <ul className="u-list-blank">
        {teamMembers.map((member) => (
          <Member key={member.childId} member={member} />
        ))}
      </ul>
    </div>
  );
};

TeamBox.propTypes = {
  team: PropTypes.objectOf(PropTypes.any).isRequired,
};

const TeamsList = () => {
  const teams = useSelector(selectTeams);

  return (
    <div className="u-flex u-flex-wrap">
      {teams.map((team) => (
        <TeamBox key={team.id} team={team} />
      ))}
    </div>
  );
};

export default TeamsPage;
