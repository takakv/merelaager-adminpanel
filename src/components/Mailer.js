import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { makePostRequest } from "./Common/requestAPI";
import { getShift } from "../features/userData/userDataSlice";
import { fetchRegistrationList, getAllRegistrationLists } from "../features/registrationList/registrationListSlice";

const Mailer = (props) => {
  const dispatch = useDispatch();
  dispatch(setTitle(props.title));

  const shiftNr = useSelector(getShift);
  // Get the registration list for all shifts from the store.
  const regListData = useSelector(getAllRegistrationLists);
  // Get the status of fetching the registration list from the backend.
  const regListStatus = useSelector((state) => state.registrationList.status);
  const regListError = useSelector((state) => state.registrationList.error);

  // Fetch all camper registration lists when the page has been rendered.
  useEffect(() => {
    if (regListStatus === "idle") dispatch(fetchRegistrationList());
  }, [regListStatus, dispatch]);

  let parentEmails = [];

  if (regListStatus === "succeeded") {
    const campers = regListData[shiftNr].campers;
    Object.values(campers).forEach(camper => {
      if (camper.registered && parentEmails.indexOf(camper.contactEmail) === -1) parentEmails.push(camper.contactEmail);
    })
  }

  const sendMail = async () => {
    const credentials = localStorage.getItem("credentials");
    const packet = {
      shift: JSON.parse(credentials).user.shift,
      text: document.getElementById("mailtext").value
    }
    await makePostRequest(
      "/mail/send/",
      packet,
    );
  }

  return (
    <div className="c-mailer">
      <p>Meilid:</p>
      <p className="c-mailer-emails">{parentEmails.sort().join("; ")}</p>
      <p><a href={`mailto:${parentEmails.join(";")}`} className="o-button">Ava meiliäpis</a>(ei pruugi töötada)</p>
      <br />
      <div className="u-unready">
        <p>See osa pole veel valmis</p>
        <p>Saadab meili vahetusse registreeritud laste vanematele.</p>
        <textarea disabled id="mailtext" className="c-mailer-box" placeholder="Sisu..."/>
        <div className="c-mailer-controls">
          <button disabled className="u-disabled">Saada</button>
          <button disabled className="u-disabled">Kontrolli</button>
        </div>
        <p><q>Kontrolli</q> saadab meili oma enda meilile.</p>
      </div>
    </div>
  );
};

export default Mailer;
