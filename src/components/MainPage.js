import React, { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { makePostRequest } from "./Common/requestAPI";
import StaffList from "../features/staffList/staffList";
import {
  selectCurrentShift,
  selectUserInfo,
} from "../features/userAuth/userAuthSlice";
import useDocumentTitle from "./useDocumentTitle";

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

const MainPage = ({ title }) => {
  const [email, setEmail] = useState();
  const [inviteRole, setInviteRole] = useState("full");

  useDocumentTitle(title);

  const shiftNr = useSelector(selectCurrentShift);
  const role = useSelector(selectUserInfo);

  const sendMail = async () => {
    if (!email || !inviteRole) return;
    const packet = {
      shiftNr,
      email,
      role: inviteRole,
    };
    const response = await makePostRequest("/su/allocate/", packet);
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
        <div className="c-card">
          <p>Saada kasvatajale ligipääs:</p>
          <div className="o-infield">
            <div className="o-infield-input">
              <label htmlFor="usr-mail">Meil:</label>
              <input
                id="usr-mail"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
            <div className="o-infield-input">
              <label htmlFor="usr-role">Roll:</label>
              <select
                id="usr-role"
                name="invite-role"
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="full">Kasvataja</option>
                <option value="part">Abikasvataja</option>
              </select>
            </div>
            <div className="o-infield-actions">
              <button type="button" className="o-button" onClick={sendMail}>
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
