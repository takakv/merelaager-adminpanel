import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentShift } from "../features/userAuth/userAuthSlice";
import {
  fetchRegistrations,
  selectShiftRegistrations,
} from "../features/registrations/registrationsSlice";
import useDocumentTitle from "./useDocumentTitle";

const Mailer = ({ title }) => {
  const dispatch = useDispatch();

  useDocumentTitle(title);

  const shiftNr = useSelector(selectCurrentShift);
  const registrations = useSelector((state) =>
    selectShiftRegistrations(state, shiftNr)
  );
  const registrationStatus = useSelector((state) => state.registrations.status);
  const registrationError = useSelector((state) => state.registrations.error);

  useEffect(() => {
    if (registrationStatus === "idle") dispatch(fetchRegistrations());
  }, [registrationStatus, dispatch]);

  const parentEmails = [];

  if (registrationStatus === "succeeded") {
    if (!registrations) {
      return <div>Kontaktinfo puudub</div>;
    }
    Object.values(registrations).forEach((registration) => {
      if (
        registration.registered &&
        parentEmails.indexOf(registration.contactEmail) === -1
      )
        parentEmails.push(registration.contactEmail);
    });
  } else return <div>{registrationError}</div>;

  // const sendMail = async () => {
  //   const credentials = localStorage.getItem("credentials");
  //   const packet = {
  //     shift: JSON.parse(credentials).user.shift,
  //     text: document.getElementById("mailtext").value,
  //   };
  //   await makePostRequest("/mail/send/", packet);
  // };

  return (
    <div className="c-mailer">
      <p>Meilid:</p>
      <p className="c-card">{parentEmails.sort().join("; ")}</p>
      <p>
        <a
          href={`mailto:${parentEmails.join(";")}`}
          className="o-button c-card__button"
        >
          Ava meiliäpis
        </a>
        (ei pruugi töötada)
      </p>
      <br />
      <div className="u-unready">
        <p>See osa pole veel valmis</p>
        <p>Saadab meili vahetusse registreeritud laste vanematele.</p>
        <textarea
          disabled
          id="mailtext"
          className="c-mailer-box"
          placeholder="Sisu..."
        />
        <div className="c-mailer-controls">
          <button type="button" disabled className="u-disabled">
            Saada
          </button>
          <button type="button" disabled className="u-disabled">
            Kontrolli
          </button>
        </div>
        <p>
          <q>Kontrolli</q> saadab meili oma enda meilile.
        </p>
      </div>
    </div>
  );
};

Mailer.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Mailer;
