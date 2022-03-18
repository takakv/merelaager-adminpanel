/* eslint-disable react/forbid-prop-types */
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";
import { makePostRequest } from "../../components/Common/requestAPI";
import { removeCamper } from "../registrationList/registrationListSlice";
import { getRole } from "../userData/userDataSlice";
import { updateRegistration } from "./registrationsSlice";

const calculateAge = (dob, delta) => {
  const elapsed = delta - dob.getTime();

  const yearInMs = 3.15576e10; // 365.25 * 24 * 60 * 60 * 1000
  return Math.floor(elapsed / yearInMs);
};

const setCellValue = (value, mono = false) => {
  if (mono) return <td className="u-mono">{value}</td>;
  return <td>{value}</td>;
};

const ToggleButton = ({ id, field, value }) => {
  const dispatch = useDispatch();

  const reqObj = { id, field, data: {} };

  const toggleState = () => {
    reqObj.data[field] = !value;
    dispatch(updateRegistration(reqObj));
  };

  return (
    <button type="button" className="o-button--40" onClick={toggleState}>
      {value ? "jah" : "ei"}
    </button>
  );
};

ToggleButton.propTypes = {
  id: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
};

const Deleter = ({ id }) => {
  const dispatch = useDispatch();

  const remove = async () => {
    const response = await makePostRequest(`reglist/remove/${id}/`);
    if (!response || !response.ok) return;

    dispatch(removeCamper({ id }));
  };

  return (
    <button type="button" onClick={remove} className="c-regList-del">
      X
    </button>
  );
};

Deleter.propTypes = {
  id: PropTypes.number.isRequired,
};

export const OrderCell = ({ registration, isMyShift }) => {
  if (!registration.registered && isMyShift)
    return (
      <td className="u-mono u-relative">
        {registration.order}
        <Deleter id={registration.id} />
      </td>
    );

  return <td className="u-mono u-relative">{registration.order}</td>;
};

OrderCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
  isMyShift: PropTypes.bool.isRequired,
};

export const PircePaidCell = ({ registration }) => {
  const role = useSelector(getRole);
  return setCellValue(registration.pricePaid, true);
};

PircePaidCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export const PriceToPayCell = ({ registration }) => {
  const role = useSelector(getRole);
  return setCellValue(registration.priceToPay, true);
};

PriceToPayCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

// Text type cells.

export const ContactCell = ({ registration }) => {
  const role = useSelector(getRole);
  if (role === "full") return setCellValue("-");
  return setCellValue(
    `${registration.contactName}, ${registration.contactPhone}`
  );
};

ContactCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export const EmailCell = ({ registration }) => {
  const role = useSelector(getRole);
  if (role === "full") return setCellValue("-");
  return setCellValue(registration.contactEmail);
};

EmailCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export const AgeCell = ({ registration }) => {
  const { dob } = registration;
  const age = calculateAge(new Date(dob), new Date());

  return (
    <td>
      <span className="u-mono">{age}</span>a
    </td>
  );
};

AgeCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export const ShirtCell = ({ registration }) =>
  setCellValue(registration.shirtSize);

ShirtCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export const BillNrCell = ({ registration }) =>
  setCellValue(registration.billNr, true);

BillNrCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

// Toggle type cells.

export const RegisteredCell = ({ registration, isMyShift }) => {
  const role = useSelector(getRole);
  const { registered } = registration;

  if (!isMyShift || role === "full")
    return setCellValue(registered ? "jah" : "ei");

  const cellValue = (
    <ToggleButton id={registration.id} field="registered" value={registered} />
  );
  return setCellValue(cellValue);
};

RegisteredCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
  isMyShift: PropTypes.bool.isRequired,
};

export const ReturningCell = ({ registration, isMyShift }) => {
  const role = useSelector(getRole);
  const { old } = registration;

  if (!isMyShift || role === "full") return setCellValue(old ? "jah" : "ei");

  const cellValue = (
    <ToggleButton id={registration.id} field="old" value={old} />
  );
  return setCellValue(cellValue);
};

ReturningCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
  isMyShift: PropTypes.bool.isRequired,
};
