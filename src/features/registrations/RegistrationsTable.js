import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";
import { selectShiftRegistrations } from "./registrationsSlice";

const RegistrationsTable = ({ shiftNr }) => {
  const registrations = useSelector((state) =>
    selectShiftRegistrations(state, shiftNr)
  );
  console.log(registrations);
  return <p>Here they are</p>;
};

RegistrationsTable.propTypes = {
  shiftNr: PropTypes.number.isRequired,
};

export default RegistrationsTable;
