import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  selectCurrentShift,
  selectUserShifts,
  updateCurrentShift,
} from "../features/userAuth/userAuthSlice";

const ShiftOption = ({ shiftNr }) => {
  const dispatch = useDispatch();

  const changeShift = async () => dispatch(updateCurrentShift(shiftNr));

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
  const shifts = shiftList.filter((shift) => shift.id !== shiftNr);
  shifts.sort((shift) => shift.id);

  return (
    <div className={`c-switch-options${isHidden ? "" : " is-visible"}`}>
      {shifts.map((shift) => (
        <ShiftOption shiftNr={shift.id} key={shift.id} />
      ))}
    </div>
  );
};

ShiftOptions.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  shiftNr: PropTypes.number.isRequired,
  shiftList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

const ShiftSwitcher = () => {
  const [hidden, setHidden] = useState(true);

  const shiftNr = useSelector(selectCurrentShift);
  const shifts = useSelector(selectUserShifts);

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
