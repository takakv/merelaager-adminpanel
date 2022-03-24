import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { makePostRequest } from "./Common/requestAPI";
import StaffList from "../features/staffList/staffList";
import {
  selectCurrentShift,
  selectUserInfo,
} from "../features/userAuth/userAuthSlice";

const CurrentDate = () => {
  const [date] = useState(
    new Intl.DateTimeFormat("et-EE", { dateStyle: "full" }).format()
  );
  return (
    <div className="c-card">
      <div>
        <p>{date}</p>
      </div>
    </div>
  );
};

const MainPage = (props) => {
  const { title } = props;
  const [email, setEmail] = useState();
  const dispatch = useDispatch();
  dispatch(setTitle(title));

  const shiftNr = useSelector(selectCurrentShift);
  const role = useSelector(selectUserInfo);

  const sendMail = async () => {
    const packet = {
      shiftNr,
      email,
    };
    const response = await makePostRequest("/su/ct/", packet);
    if (response && response.ok) alert("Meil edukalt saadetud");
  };

  if (role === "op") {
    return <StaffList shiftNr={shiftNr} />;
  }
  return (
    <div className="c-landing-grid">
      <div className="c-card-wrapper c-dateblock">
        <CurrentDate />
      </div>
      <div className="c-card-wrapper c-teambox">
        <StaffList shiftNr={shiftNr} />
      </div>
      <div className="c-card-wrapper c-mailsendbox">
        <div className="c-card c-mailsend">
          <p>Saada kasvatajale ligipääs:</p>
          <div className="c-mailsend-ia">
            <div className="c-mailsend-input">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="usr-mail">Meil</label>
              <input
                id="usr-mail"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
            <div className="c-mailsend-actions">
              <button type="button" className="o-button c-card__button" onClick={sendMail}>
                Saada link
              </button>
            </div>
          </div>
          <p>
            Ligipääsu piktogramm läheb roheliseks siis, kui kasvataja on endale
            konto loonud.
          </p>
        </div>
      </div>
    </div>
  );
};

MainPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default MainPage;
