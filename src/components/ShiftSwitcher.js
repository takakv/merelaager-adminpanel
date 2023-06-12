import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";
import {selectCurrentShift, selectUserShifts, updateCurrentShift,} from "../features/userAuth/userAuthSlice";

const ShiftOption = ({shiftNr}) => {
  const dispatch = useDispatch();

  const changeShift = async () => dispatch(updateCurrentShift(shiftNr));

  const handleKeyPress = async ({key}) => {
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

const ShiftOptions = ({isHidden, currentShiftNr, shiftList}) => {
  const shiftNumbers = shiftList.filter((shiftNr) => shiftNr !== currentShiftNr);
  shiftNumbers.sort((shift) => shift.id);

  return (
    <div className={`c-switch-options${isHidden ? "" : " is-visible"}`}>
      {shiftNumbers.map((shiftNr) => (
        <ShiftOption shiftNr={shiftNr} key={shiftNr}/>
      ))}
    </div>
  );
};

ShiftOptions.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  currentShiftNr: PropTypes.number.isRequired,
  shiftList: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const ShiftSwitcher = () => {
  const [hidden, setHidden] = useState(true);

  const currentShiftNr = useSelector(selectCurrentShift);
  const shiftRoles = useSelector(selectUserShifts);

  const shifts = Object.keys(shiftRoles).map(key => parseInt(key, 10))
  const hasSingleShift = shifts.length === 1;

  const toggleHidden = () => {
    setHidden(!hidden);
  };

  return (
    <div className="c-switch">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={`c-switch-current${hasSingleShift ? " is-unique" : ""}`}
        onClick={toggleHidden}
        role="button"
        tabIndex={0}
      >
        <p>{currentShiftNr}. vahetus</p>
      </div>
      {hasSingleShift ? (
        ""
      ) : (
        <ShiftOptions isHidden={hidden} currentShiftNr={currentShiftNr} shiftList={shifts}/>
      )}
    </div>
  );
};

export default ShiftSwitcher;
