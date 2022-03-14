import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  getShift,
  getShifts,
  setRole,
  setShift,
} from "../features/userData/userDataSlice";
import { makePostRequest } from "./Common/requestAPI";

const sendShift = async (shiftNr) => {
  const response = await makePostRequest(`su/shift/swap`, {
    shiftNr,
  });

  if (!response.ok) {
    alert("Puuduvad juurdepääsuõigused");
    return null;
  }

  return response.json();
};

const ShiftOption = ({ shiftNr }) => {
  const dispatch = useDispatch();

  const changeShift = async () => {
    const result = await sendShift(shiftNr);
    if (!result) return;

    dispatch(setRole(result.role));
    dispatch(setShift(shiftNr));
    window.location.reload();
  };

  const handleKeyPress = async ({ key }) => {
    if (key === "Enter") await changeShift();
  };

  return (
    <div
      className="c-switch-option"
      onClick={changeShift}
      role="button"
      tabIndex={0}
      onKeyPress={handleKeyPress}
    >
      {shiftNr}. vahetus
    </div>
  );
};

ShiftOption.propTypes = {
  shiftNr: PropTypes.number.isRequired,
};

const ShiftOptions = ({ isHidden, shiftNr, shiftList }) => {
  const shifts = [...shiftList];
  const currentIndex = shifts.indexOf(shiftNr);
  shifts.splice(currentIndex, 1);
  shifts.sort();

  return (
    <div className={`c-switch-options${isHidden ? "" : " is-visible"}`}>
      {shifts.map((nr) => (
        <ShiftOption shiftNr={nr} key={nr} />
      ))}
    </div>
  );
};

ShiftOptions.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  shiftNr: PropTypes.number.isRequired,
  shiftList: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const ShiftSwitcher = () => {
  const [hidden, setHidden] = useState(true);

  const shiftNr = useSelector(getShift);
  const shifts = [...useSelector(getShifts)];

  const unique = shifts.length === 1;

  const toggleHidden = () => {
    setHidden(!hidden);
  };

  return (
    <div className="c-switch">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={`c-switch-current${unique ? " is-unique" : ""}`}
        onClick={toggleHidden}
        role="button"
        tabIndex={0}
      >
        <p>{shiftNr}. vahetus</p>
      </div>
      {unique ? (
        ""
      ) : (
        <ShiftOptions isHidden={hidden} shiftNr={shiftNr} shiftList={shifts} />
      )}
    </div>
  );
};

export default ShiftSwitcher;
