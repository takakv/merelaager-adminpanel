import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makePostRequest } from "./Common/requestAPI";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import {
  fetchCampers,
  getCampers,
  updateCamper,
} from "../features/tents/campersSlice";

// THIS FILE CONTAINS TERRIBLE CODE THAT NEEDS REFACTORING!

// Populate the options dropdown for campers with a tent.
const tentNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

const TentList = (props) => {
  const dispatch = useDispatch();
  dispatch(setTitle(props.title));
  const shiftData = useSelector(getCampers);
  const shiftStatus = useSelector((state) => state.campers.status);
  const error = useSelector((state) => state.campers.error);

  useEffect(() => {
    if (shiftStatus === "idle") dispatch(fetchCampers());
  }, [shiftStatus, dispatch]);

  if (shiftStatus === "succeeded") {
    return (
      <div>
        <div className="c-tentless__container">
          {shiftData
            .filter((camper) => !camper["tent"])
            .map((camper) => (
              <NoTentCamper name={camper.name} key={camper.id} id={camper.id} />
            ))}
        </div>
        <div className="c-tent__container">
          {tentNumbers.map((tentNumber) => (
            <TentBlock key={tentNumber.toString()} tentNumber={tentNumber} />
          ))}
        </div>
      </div>
    );
  } else if (shiftStatus === "failed") {
    return <p>{error}</p>;
  } else return <p>Laen...</p>;
};

export default TentList;

const NoTentCamper = (props) => {
  const dispatch = useDispatch();
  const addCamperToTent = async ({ target }) => {
    await makePostRequest("tents/update/" + `${props.id}/${target.value}/`);
    dispatch(updateCamper({ id: props.id, tent: parseInt(target.value) }));
  };

  return (
    <div className="c-tentless">
      <p>{props.name}</p>
      <label>
        <select name="tent" onChange={addCamperToTent}>
          <option value="0" style={{ color: "grey" }}>
            Telk
          </option>
          {tentNumbers.map((nr) => (
            <option value={nr} key={nr}>
              {nr}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

const TentBlock = (props) => {
  const campers = useSelector(getCampers).filter(
    (campers) => campers["tent"] === props.tentNumber
  );

  return (
    <div className="c-tent">
      <p className="c-tent-header">{props.tentNumber}</p>
      <ul>
        {campers.map((camper) => (
          <TentBlockCamper camper={camper} key={camper.id} />
        ))}
      </ul>
    </div>
  );
};

const TentBlockCamper = (props) => {
  const dispatch = useDispatch();
  const removeCamperFromTent = async () => {
    await makePostRequest("tents/update/" + `${props.camper.id}/0/`);
    dispatch(updateCamper({ id: props.camper.id, tent: 0 }));
  };

  return (
    <li className="u-list-blank c-tent-child">
      <span>{props.camper.name}</span>
      <div className="c-tent-child__rm" onClick={removeCamperFromTent}>
        <div />
      </div>
    </li>
  );
};
