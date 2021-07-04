import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { getShift } from "../features/userData/userDataSlice";
import {
  addMember,
  fetchTeams,
  getTeams,
  removeMember,
} from "../features/teams/teamerSlice";
import { makePostRequest } from "./Common/requestAPI";

const TeamPlace = (props) => {
  const updatePlace = async ({ target }) => {
    if (!target.value) return;
    if (target.value < 1 || target.value > props.teamCount) {
      alert(`Kohad peavad olema 1–${props.teamCount}`);
      return;
    }
    await makePostRequest("teams/set/place/", {
      teamId: props.team.id,
      place: target.value,
    });
  };

  return (
    <input
      type="number"
      min={1}
      max={props.teamCount}
      onBlur={updatePlace}
      defaultValue={props.team.place}
    />
  );
};

const Leaderboard = (props) => {
  const teams = useSelector(getTeams).teams;
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
  const shiftNr = useSelector(getShift);
  const dispatch = useDispatch();
  dispatch(setTitle(props.title));

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
  } else if (teamsStatus === "nok") {
    return (
      <div>
        <TeamCreator shiftNr={shiftNr} />
        <p>{teamsError}</p>
      </div>
    );
  } else
    return (
      <div>
        <TeamCreator shiftNr={shiftNr} />
        <p>Laen...</p>
      </div>
    );
};

const TeamCreator = (props) => {
  const [teamName, setTeamName] = useState();

  const handleChange = (event) => {
    setTeamName(event.target.value);
  };

  const createTeam = async () => {
    const response = await makePostRequest("/teams/create/", {
      shiftNr: props.shiftNr,
      name: teamName,
    });
    if (!response || !response.ok) return;
    window.location.reload();
  };

  return (
    <div>
      <label>
        Meeskonna nimi:
        <input type="text" onChange={handleChange} />
      </label>
      <button onClick={createTeam}>Loo meeskond</button>
    </div>
  );
};

const Teamless = (props) => {
  const dispatch = useDispatch();

  const addCamperToTeam = async ({ target }) => {
    const response = await makePostRequest("teams/member/add/", {
      teamId: target.value,
      dataId: props.camper.id,
    });
    if (!response || !response.ok) return;

    dispatch(
      addMember({
        member: props.camper,
        teamId: target.value,
      })
    );
  };

  return (
    <div className="c-teamless">
      <p>{props.camper.name}</p>
      <label>
        <select onChange={addCamperToTeam}>
          <option value={null} style={{ color: "grey" }}>
            Vali meeskond
          </option>
          {Object.values(props.teams).map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
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
  const dispatch = useDispatch();
  const removeCamperFromTeam = async () => {
    const response = await makePostRequest("teams/member/remove/", {
      dataId: props.member.id,
    });
    if (!response || !response.ok) return;

    dispatch(
      removeMember({
        member: props.member,
        currentTeam: props.teamId,
      })
    );
  };

  return (
    <li className="u-flex u-space-between u-align-center">
      <span>{props.member.name}</span>
      <div className="c-team-rm" onClick={removeCamperFromTeam}>
        <div />
      </div>
    </li>
  );
};

const TeamBox = (props) => {
  return (
    <div className="c-team o-box">
      <div className="o-box-header u-text-center">
        <h3>{props.team.name}</h3>
        <p>{props.team.place ?? "-"}. koht</p>
        {/*<div>*/}
        {/*  <input*/}
        {/*    className="u-text-right"*/}
        {/*    defaultValue={props.team.place ?? "-"}*/}
        {/*  />. koht*/}
        {/*</div>*/}
      </div>
      <ul className={"u-list-blank"}>
        {props.team.members.map((member) => (
          <Member key={member.id} member={member} teamId={props.team.id} />
        ))}
      </ul>
    </div>
  );
};

const TeamsList = () => {
  const teams = useSelector(getTeams).teams;

  return (
    <div className="u-flex u-flex-wrap">
      {Object.values(teams).map((team) => (
        <TeamBox key={team.id} team={team} />
      ))}
    </div>
  );
};

export default TeamsPage;
