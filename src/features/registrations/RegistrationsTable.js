import PropTypes from "prop-types";
import React from "react";
import RegistrationsTableHeader from "./RegistrationsTableHeader";
import RegistrationsTableBody from "./RegistrationsTableBody";

const RegistrationsTable = ({ shiftNr }) => (
  <table className="c-regList-table">
    <RegistrationsTableHeader />
    <RegistrationsTableBody shiftNr={shiftNr} registered gender="M" />
    <RegistrationsTableBody shiftNr={shiftNr} registered gender="F" />
    <RegistrationsTableBody shiftNr={shiftNr} gender="M" />
    <RegistrationsTableBody shiftNr={shiftNr} gender="F" />
  </table>
);

RegistrationsTable.propTypes = {
  shiftNr: PropTypes.number.isRequired,
};

export default RegistrationsTable;
