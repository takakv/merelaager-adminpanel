import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectGroupRegistrations } from "./registrationsSlice";
import RegistrationsTableEntry from "./RegistrationsTableEntry";

const calculateMeanAge = (registrations) => {
  const now = new Date();
  let ageSum = 0;

  registrations.forEach((registration) => {
    const {dob} = registration;
    const birthDate = new Date(dob);
    let age = now.getFullYear() - birthDate.getFullYear();
    // Calculate the standing for June of the current year.
    const mon = 5 - birthDate.getMonth();
    if (mon < 0) age -= 1;
    ageSum += age;
  });

  return Math.round(ageSum / registrations.length * 10) / 10;
};

const RegistrationsTableBody = ({ shiftNr, registered, gender }) => {
  let title;

  const registrations = useSelector((state) =>
    selectGroupRegistrations(state, shiftNr, registered, gender)
  );

  if (registered) title = gender === "M" ? "Poisid" : "Tüdrukud";
  else title = gender === "M" ? "Reserv poisid" : "Reserv tüdrukud";

  const meanAge = calculateMeanAge(registrations);
  title += ` | Keskmine vanus: ${meanAge}a`

  return (
    <tbody>
      <tr>
        <th colSpan="14">{title}</th>
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
