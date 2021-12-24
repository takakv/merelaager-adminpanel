import React from "react";
import { useSelector } from "react-redux";
import { getShift, getShifts } from "../features/userData/userDataSlice";

const ShiftOptions = () => {
  const shift = useSelector(getShift);
  const shifts = [...useSelector(getShifts)];
  const currentIndex = shifts.indexOf(shift);
  shifts.splice(currentIndex, 1);

  return <div className="c-switch-options">{}</div>;
};

const ShiftSwitcher = () => {
  const shiftNr = useSelector(getShift);
  return (
    <div className="c-switch">
      <div className="c-switch-current">
        <p>{shiftNr}. vahetus</p>
      </div>
      <ShiftOptions />
    </div>
  );
};

export default ShiftSwitcher;
