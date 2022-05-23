import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getName } from "../features/userData/userDataSlice";
import {
  selectRootStatus,
  selectRootUsage,
  setRootUsage,
} from "../features/userAuth/userAuthSlice";

/*
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
*/

const UserBox = () => {
  const dispatch = useDispatch();

  const userName = useSelector(getName);
  const isRoot = useSelector(selectRootStatus);
  const useRoot = useSelector(selectRootUsage);

  const handleChange = ({ target }) => {
    dispatch(setRootUsage(target.checked));
  };

  let rootSwitcher = null;
  if (isRoot)
    rootSwitcher = (
      <div className="c-toggle-switch__container root-switch">
        <label htmlFor="root-switch">Juurpääs</label>
        <input
          id="root-switch"
          type="checkbox"
          defaultChecked={useRoot}
          onChange={handleChange}
        />
      </div>
    );

  return (
    <div className="admin-page__user">
      {/* <p>ShiftNr: {shiftNr}</p> */}
      {/* <input type="text" onBlur={updateShift} /> */}
      {rootSwitcher}
      <span>{userName}</span>
    </div>
  );
};

export default UserBox;
