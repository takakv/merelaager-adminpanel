import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { getShift } from "../features/userData/userDataSlice";
import { makePostRequest } from "./Common/requestAPI";

const MainPage = (props) => {
  const [email, setEmail] = useState();
  const dispatch = useDispatch();
  dispatch(setTitle(props.title));

  const shiftNr = useSelector(getShift);
  const credentials = localStorage.getItem("credentials");
  const role = JSON.parse(credentials).user.role;

  const sendMail = async () => {
    const packet = {
      shiftNr,
      email,
    };
    const response = await makePostRequest("/su/ct/", packet);
  };

  if (role === "op") {
    return <p>Siia tekivad asjad, ent neid asju veel pole.</p>;
  } else {
    return (
      <div>
        <p>Saada kasvatajale ligipääs:</p>
        <label>
          Meil
          <input onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>
        <button onClick={sendMail}>Saada link</button>
      </div>
    );
  }
};

export default MainPage;
