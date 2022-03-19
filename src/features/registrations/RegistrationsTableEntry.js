import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";
import { getRole, getShift } from "../userData/userDataSlice";
import {
  AgeCell,
  BillNrCell,
  ContactCell,
  EmailCell,
  OrderCell,
  PricePaidCell,
  PriceToPayCell,
  RegisteredCell,
  ReturningCell,
  ShirtCell,
} from "./registrationsTableCells";

const RegistrationsTableEntry = ({ registration }) => {
  const role = useSelector(getRole);
  const myShift = useSelector(getShift);

  const isMyShift = role === "root" ? true : registration.shiftNr === myShift;

  const cells = [];

  cells.push(
    <OrderCell key="order" registration={registration} isMyShift={isMyShift} />
  );
  cells.push(<td key="name">{registration.name}</td>);

  if (role !== "full") {
    cells.push(<PricePaidCell key="pricePaid" registration={registration} />);
    cells.push(<PriceToPayCell key="priceToPay" registration={registration} />);
  }

  cells.push(
    <RegisteredCell
      key="isRegistered"
      registration={registration}
      isMyShift={isMyShift}
    />
  );

  if (role !== "full") {
    cells.push(<ContactCell key="contact" registration={registration}/>);
    cells.push(<EmailCell key="email" registration={registration}/>);
  }

  cells.push(
    <ReturningCell
      key="isOld"
      registration={registration}
      isMyShift={isMyShift}
    />
  );

  cells.push(<AgeCell key="age" registration={registration} />);
  cells.push(<ShirtCell key="shirt" registration={registration} />);

  if (role !== "full")
    cells.push(<BillNrCell key="billNr" registration={registration} />);

  return <tr>{cells.map((cell) => cell)}</tr>;
};

RegistrationsTableEntry.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default RegistrationsTableEntry;
