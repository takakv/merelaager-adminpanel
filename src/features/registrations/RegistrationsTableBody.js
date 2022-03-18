import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getRole } from "../userData/userDataSlice";
import { selectGroupRegistrations } from "./registrationsSlice";
import RegistrationsTableEntry from "./RegistrationsTableEntry";

const RegistrationsTableBody = ({ shiftNr, registered, gender }) => {
  const role = useSelector(getRole);

  let title;

  if (registered) title = gender === "M" ? "Poisid" : "Tüdrukud";
  else title = gender === "M" ? "Reserv poisid" : "Reserv tüdrukud";

  const registrations = useSelector((state) =>
    selectGroupRegistrations(state, shiftNr, registered, gender)
  );

  console.log(registrations);

  return (
    <tbody>
      <tr>
        <th>{title}</th>
      </tr>
      {registrations.map((registration) => (
        <RegistrationsTableEntry
          key={registration.id}
          registration={registration}
        />
      ))}
    </tbody>
  );
};

RegistrationsTableBody.propTypes = {
  shiftNr: PropTypes.number.isRequired,
  registered: PropTypes.bool,
  gender: PropTypes.string.isRequired,
};

RegistrationsTableBody.defaultProps = {
  registered: false,
};

export default RegistrationsTableBody;
