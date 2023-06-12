import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";
import { getRole } from "../userData/userDataSlice";
import {
  AgeCell,
  BillNrCell,
  ContactCell,
  EmailCell,
  NameCell,
  OrderCell,
  PricePaidCell,
  PriceToPayCell,
  RegisteredCell,
  ReturningCell,
  ShirtCell,
} from "./registrationsTableCells";
import { selectDetailView } from "./registrationsSlice";
import { selectRole } from "../userAuth/userAuthSlice";

const RegistrationsTableEntry = ({ registration }) => {
  const role = useSelector(getRole);
  const displayedShiftRole = useSelector((state) =>
    selectRole(state, registration.shiftNr)
  );
  const isDetailedView = useSelector(selectDetailView);

  const isMyShift = role === "root" ? true : displayedShiftRole === "boss";

  const cells = [];

  if (isDetailedView)
    cells.push(
      <OrderCell
        key="order"
        registration={registration}
        isMyShift={isMyShift}
      />
    );

  cells.push(<NameCell key="name" registration={registration} />);

  if (isDetailedView) {
    if (Object.hasOwn(registration, "pricePaid"))
      cells.push(<PricePaidCell key="pricePaid" registration={registration} />);
    if (Object.hasOwn(registration, "priceToPay"))
      cells.push(
        <PriceToPayCell key="priceToPay" registration={registration} />
      );

    cells.push(
      <RegisteredCell key="isRegistered" registration={registration} />
    );
  }

  if (Object.hasOwn(registration, "contactName"))
    cells.push(<ContactCell key="contact" registration={registration} />);

  if (Object.hasOwn(registration, "contactEmail"))
    cells.push(<EmailCell key="email" registration={registration} />);

  cells.push(
    <ReturningCell
      key="isOld"
      registration={registration}
      isDetailedView={isDetailedView}
    />
  );

  cells.push(<AgeCell key="age" registration={registration} />);

  if (isDetailedView)
    cells.push(<ShirtCell key="shirt" registration={registration} />);

  if (isDetailedView && Object.hasOwn(registration, "billNr"))
    cells.push(<BillNrCell key="billNr" registration={registration} />);

  return <tr>{cells.map((cell) => cell)}</tr>;
};

RegistrationsTableEntry.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default RegistrationsTableEntry;
