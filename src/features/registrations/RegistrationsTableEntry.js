import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";
import { makePostRequest } from "../../components/Common/requestAPI";
import { removeCamper } from "../registrationList/registrationListSlice";
import { getRole, getShift } from "../userData/userDataSlice";

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

const OrderEntry = ({ registration }) => {
  const role = useSelector(getRole);
  const myShift = useSelector(getShift);

  const isMyShift = role === "root" ? true : registration.shiftNr === myShift;

  let value = `${registration.order}`;
  if (!registration.registered && isMyShift)
    value += <Deleter id={registration.id} />;

  return <td className="u-mono u-relative">{value}</td>;
};

OrderEntry.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

const RegistrationsTableEntry = ({ registration }) => {
  const cells = [];

  cells.push(<OrderEntry key="order" registration={registration} />);
  cells.push(<td key="name">{registration.name}</td>);

  return <tr>{cells.map((cell) => cell)}</tr>;
};

RegistrationsTableEntry.propTypes = {
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default RegistrationsTableEntry;
