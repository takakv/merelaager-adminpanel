import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makePostRequest } from "./Common/requestAPI";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import {
  fetchCampers,
  getCampers,
  updateCamper,
} from "../features/tents/campersSlice";
import { getShift } from "../features/userData/userDataSlice";

// THIS FILE CONTAINS TERRIBLE CODE THAT NEEDS REFACTORING!

// Populate the options dropdown for campers with a tent.
const tentNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

const TentList = (props) => {
  const shiftNr = useSelector(getShift);
  const dispatch = useDispatch();
  dispatch(setTitle(props.title));

  const tentData = useSelector(getCampers);
  const shiftStatus = useSelector((state) => state.campers.status);
  const error = useSelector((state) => state.campers.error);

  useEffect(() => {
    if (shiftStatus === "idle") dispatch(fetchCampers(shiftNr));
  }, [shiftStatus, dispatch]);

  if (shiftStatus === "succeeded") {
    return (
      <div>
        <div className="c-tentless-container u-flex u-flex-wrap">
          {tentData.tentless.map((camper) => (
            <NoTentCamper key={camper.id} id={camper.id} name={camper.name} />
          ))}
        </div>
        <div className="u-flex u-flex-wrap">
          {tentData.tents.map((tent, index) => (
            <TentBlock
              key={index.toString()}
              tentMembers={tent}
              tentNumber={index}
            />
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
  const shiftNr = useSelector(getShift);
  const dispatch = useDispatch();
  const addCamperToTent = async ({ target }) => {
    await makePostRequest(
      "tents/update/" + `${shiftNr}/${props.id}/${target.value}/`
    );
    dispatch(updateCamper({ id: props.id, tentNr: parseInt(target.value) }));
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
  return (
    <div className="c-tent o-box">
      <h3 className="o-box-header u-text-center">{props.tentNumber + 1}</h3>
      <ul className="u-list-blank">
        {props.tentMembers.map((camper) => (
          <TentBlockCamper
            camper={camper}
            key={camper.id}
            tentNumber={props.tentNumber}
          />
        ))}
      </ul>
    </div>
  );
};

const TentBlockCamper = (props) => {
  const shiftNr = useSelector(getShift);
  const dispatch = useDispatch();
  const removeCamperFromTent = async () => {
    await makePostRequest("tents/update/" + `${shiftNr}/${props.camper.id}/0/`);
    dispatch(
      updateCamper({
        id: props.camper.id,
        tentNr: 0,
        currentNr: props.tentNumber,
      })
    );
  };

  return (
    <li className="u-flex u-space-between u-align-center">
      <span>{props.camper.name}</span>
      <div className="c-tent-rm" onClick={removeCamperFromTent}>
        <div />
      </div>
    </li>
  );
};
