/* eslint-disable react/no-array-index-key */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { makePostRequest } from "./Common/requestAPI";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import {
  fetchCampers,
  getCampers,
  updateCamper,
  updatePresence,
} from "../features/tents/campersSlice";
import { getShift } from "../features/userData/userDataSlice";

// THIS FILE CONTAINS TERRIBLE CODE THAT NEEDS REFACTORING!

// Populate the options dropdown for campers with a tent.
const tentNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

const TentList = (props) => {
  const { title } = props;
  const shiftNr = useSelector(getShift);
  const dispatch = useDispatch();
  dispatch(setTitle(title));

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
          {tentData.noTent.map((camper) => (
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
  }
  if (shiftStatus === "failed") {
    return <p>{error}</p>;
  }
  return <p>Laen...</p>;
};

TentList.propTypes = {
  title: PropTypes.string.isRequired,
};

export default TentList;

const NoTentCamper = (props) => {
  const { name, id } = props;
  const dispatch = useDispatch();

  const addCamperToTent = async ({ target }) => {
    await makePostRequest(`tents/update/${id}/${target.value}/`);
    dispatch(updateCamper({ id, tentNr: parseInt(target.value, 10) }));
  };

  return (
    <div className="c-tentless">
      <p>{name}</p>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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

NoTentCamper.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

const TentBlock = (props) => {
  const { tentMembers, tentNumber } = props;
  return (
    <div className="c-tent o-box">
      <h3 className="o-box-header u-text-center">{tentNumber + 1}</h3>
      <ul className="u-list-blank">
        {tentMembers.map((camper) => (
          <TentBlockCamper
            camper={camper}
            key={camper.id}
            tentNumber={tentNumber}
          />
        ))}
      </ul>
    </div>
  );
};

TentBlock.propTypes = {
  tentMembers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  tentNumber: PropTypes.number.isRequired,
};

const TentBlockCamper = (props) => {
  const { camper, tentNumber } = props;
  const dispatch = useDispatch();

  const removeCamperFromTent = async () => {
    await makePostRequest(`tents/update/${camper.id}/0/`);
    dispatch(
      updateCamper({
        id: camper.id,
        tentNr: 0,
        currentNr: tentNumber,
      })
    );
  };

  const togglePresence = async ({ target }) => {
    const result = await makePostRequest(`tents/update/presence/`, {
      id: camper.id,
    });
    if (!result.ok) return;
    dispatch(
      updatePresence({
        id: camper.id,
        isPresent: target.checked,
        currentNr: tentNumber,
      })
    );
  };

  return (
    <li className="u-flex u-space-between u-align-center">
      <span>{camper.name}</span>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className="c-tent-side">
        <input
          className="c-tent-presence"
          type="checkbox"
          defaultChecked={camper.isPresent}
          onChange={togglePresence}
        />
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <div
          role="button"
          className="c-tent-rm"
          onClick={removeCamperFromTent}
          tabIndex={0}
        >
          <div />
        </div>
      </div>
    </li>
  );
};

TentBlockCamper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  camper: PropTypes.objectOf(PropTypes.any).isRequired,
  tentNumber: PropTypes.number.isRequired,
};
