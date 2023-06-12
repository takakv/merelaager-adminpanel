/* eslint-disable react/forbid-prop-types */
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";
import { getRole } from "../userData/userDataSlice";
import { deleteRegistration, updateRegistration } from "./registrationsSlice";
import {
  selectRole,
  selectRootStatus,
  selectRootUsage,
} from "../userAuth/userAuthSlice";
import constants from "../../utils/constants";

// Helper functions.

const calculateAge = (dob, delta) => {
  const elapsed = delta - dob.getTime();

  const yearInMs = 3.15576e10; // 365.25 * 24 * 60 * 60 * 1000
  return Math.floor(elapsed / yearInMs);
};

// Helper modules.

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

const InputField = ({ id, field, value }) => {
  const dispatch = useDispatch();

  const reqObj = { id, field, data: {} };

  const handleChange = ({ target }) => {
    const sum = parseInt(target.value, 10);
    if (isNaN(sum)) {
      alert("Ainult numbrid");
      return;
    }
    reqObj.data[field] = sum;
    dispatch(updateRegistration(reqObj));
  };

  return (
    <input
      className="u-mono"
      type="text"
      defaultValue={value}
      onBlur={handleChange}
    />
  );
};

InputField.propTypes = {
  id: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

const Deleter = ({ id }) => {
  const dispatch = useDispatch();

  const remove = async () => {
    dispatch(deleteRegistration(id));
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

// Text type cells.

export const NameCell = ({ registration }) => <td>{registration.name}</td>;

NameCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
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

export const ContactCell = ({ registration }) =>
  setCellValue(`${registration.contactName}, ${registration.contactPhone}`);

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

export const RegisteredCell = ({ registration }) => {
  const displayedShiftRole = useSelector((state) =>
    selectRole(state, registration.shiftNr)
  );
  const { registered } = registration;

  if (
    displayedShiftRole !== constants.SHIFT_ROLE_BOSS &&
    displayedShiftRole !== constants.SHIFT_ROLE_ROOT
  )
    return setCellValue(registered ? "jah" : "ei");

  const cellValue = (
    <ToggleButton id={registration.id} field="registered" value={registered} />
  );
  return setCellValue(cellValue);
};

RegisteredCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export const ReturningCell = ({ registration, isDetailedView }) => {
  const displayedShiftRole = useSelector((state) =>
    selectRole(state, registration.shiftNr)
  );
  const { old } = registration;

  if (
    !isDetailedView ||
    (displayedShiftRole !== constants.SHIFT_ROLE_BOSS &&
      displayedShiftRole !== constants.SHIFT_ROLE_ROOT)
  )
    return setCellValue(old ? "jah" : "ei");

  const cellValue = (
    <ToggleButton id={registration.id} field="old" value={old} />
  );
  return setCellValue(cellValue);
};

ReturningCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
  isDetailedView: PropTypes.bool.isRequired,
};

// Input type cells.

export const PricePaidCell = ({ registration }) => {
  const isRoot = useSelector(selectRootStatus);
  const usesRoot = useSelector(selectRootUsage);

  if (!isRoot || !usesRoot) return setCellValue(registration.pricePaid, true);
  return (
    <td id="pricePaid">
      <InputField
        field="pricePaid"
        id={registration.id}
        value={registration.pricePaid}
      />
    </td>
  );
};

PricePaidCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export const PriceToPayCell = ({ registration }) => {
  const isRoot = useSelector(selectRootStatus);
  const usesRoot = useSelector(selectRootUsage);

  if (!isRoot || !usesRoot) return setCellValue(registration.priceToPay, true);
  return (
    <td id="priceToPay">
      <InputField
        field="priceToPay"
        id={registration.id}
        value={registration.priceToPay}
      />
    </td>
  );
};

PriceToPayCell.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};
