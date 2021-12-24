import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getName,
  getShift,
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

const UserBox = () => {
  const dispatch = useDispatch();
  const userName = useSelector(getName);
  const shiftNr = useSelector(getShift);

  const updateShift = async ({ target }) => {
    const newShiftNr = parseInt(target.value, 10);

    const result = await sendShift(newShiftNr);
    if (!result) return;

    dispatch(setRole(result.role));
    dispatch(setShift(newShiftNr));
    window.location.reload();
  };

  return (
    <div className="admin-page__user">
      <p>ShiftNr: {shiftNr}</p>
      <input type="text" onBlur={updateShift} />
      <span>{userName}</span>
    </div>
  );
};

export default UserBox;
