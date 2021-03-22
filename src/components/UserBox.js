import React from "react";
import { useSelector } from "react-redux";
import { getName } from "../features/userData/userDataSlice";

const UserBox = () => {
  const userName = useSelector(getName);

  return (
    <div className="admin-page__user">
      <span>{userName}</span>
    </div>
  );
};

export default UserBox;
