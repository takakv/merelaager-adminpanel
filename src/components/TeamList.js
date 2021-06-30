import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { getShift } from "../features/userData/userDataSlice";
import { fetchTeams, getTeams } from "../features/teams/teamerSlice";
import { makePostRequest } from "./Common/requestAPI";
import {
  fetchCamperInfo,
  getCamperInfo,
} from "../features/camperInfo/camperInfoSlice";

const TeamsPage = (props) => {
  const shiftNr = useSelector(getShift);
  const dispatch = useDispatch();
  dispatch(setTitle(props.title));

  // Get the children.
  const camperInfo = useSelector(getCamperInfo);
  const camperStatus = useSelector((state) => state.camperInfo.status);
  const camperError = useSelector((state) => state.camperInfo.error);

  useEffect(() => {
    if (camperStatus === "idle") dispatch(fetchCamperInfo(shiftNr));
  }, [camperStatus, dispatch]);

  // Get the teams.
  const teams = useSelector(getTeams);
  const teamsStatus = useSelector((state) => state.teams.status);
  const teamsError = useSelector((state) => state.teams.error);

  useEffect(() => {
    if (teamsStatus === "idle") dispatch(fetchTeams(shiftNr));
  }, [teamsStatus, dispatch]);

  if (camperStatus === "ok" && teamsStatus === "ok") {
    return (
      <div>
        <TeamCreator shiftNr={shiftNr} />
        <TeamlessList campers={camperInfo} teams={teams} />
        <TeamsList campers={camperInfo} teams={teams} />
      </div>
    );
  } else if (camperStatus === "nok" || teamsStatus === "nok") {
    return (
      <div>
        <TeamCreator shiftNr={shiftNr} />
        <p>
          {camperError} {teamsError}
        </p>
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
  const addCamperToTeam = async ({ target }) => {
    await makePostRequest("teams/member/add/", {
      teamId: target.value,
      dataId: props.camper.id,
    });
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

const TeamlessList = (props) => {
  return (
    <div className="u-flex u-flex-wrap">
      {Object.values(props.campers).map((camper) => (
        <Teamless key={camper.id} camper={camper} teams={props.teams} />
      ))}
    </div>
  );
};

const Member = (props) => {};

const TeamBox = (props) => {
  return (
    <div className="c-team o-box">
      <h3 className="o-box-header u-text-center">{props.name}</h3>
      <ul className={"u-list-blank"}></ul>
    </div>
  );
};

const TeamsList = (props) => {
  return (
    <div className="u-flex u-flex-wrap">
      {Object.values(props.teams).map((team) => (
        <TeamBox key={team.id} name={team.name} members={team.members} />
      ))}
    </div>
  );
};

export default TeamsPage;
