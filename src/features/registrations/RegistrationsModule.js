import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  fetchRegistrations,
  selectShiftRegistrations,
} from "./registrationsSlice";
import RegistrationsTable from "./RegistrationsTable";

const RegistrationsModule = ({ shiftNr }) => {
  const dispatch = useDispatch();

  const registrations = useSelector((state) =>
    selectShiftRegistrations(state, shiftNr)
  );
  const registrationStatus = useSelector((state) => state.registrations.status);

  useEffect(() => {
    if (registrationStatus === "idle") dispatch(fetchRegistrations());
  }, [registrationStatus, dispatch]);

  if (registrationStatus === "succeeded") {
    if (!registrations.length) return <p>Registreerimisi pole</p>;
    return <RegistrationsTable shiftNr={shiftNr} />;
  }

  return <p>Laen...</p>;
};

RegistrationsModule.propTypes = {
  shiftNr: PropTypes.number.isRequired,
};

export default RegistrationsModule;
