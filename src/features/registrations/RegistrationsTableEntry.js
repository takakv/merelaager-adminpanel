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
  const shiftRole = useSelector((state) =>
    selectRole(state, registration.shiftNr)
  );
  const isDetailedView = useSelector(selectDetailView);

  const isMyShift = role === "root" ? true : shiftRole === "boss";

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

  if ((role === "master" || role === "root") && isDetailedView) {
    cells.push(<PricePaidCell key="pricePaid" registration={registration} />);
    cells.push(<PriceToPayCell key="priceToPay" registration={registration} />);
  }

  if (isDetailedView)
    cells.push(
      <RegisteredCell
        key="isRegistered"
        registration={registration}
        isMyShift={isMyShift}
      />
    );

  if (role === "master" || role === "root") {
    cells.push(<ContactCell key="contact" registration={registration} />);
    cells.push(<EmailCell key="email" registration={registration} />);
  }

  cells.push(
    <ReturningCell
      key="isOld"
      registration={registration}
      isMyShift={isMyShift}
      isDetailedView={isDetailedView}
    />
  );

  cells.push(<AgeCell key="age" registration={registration} />);

  if (isDetailedView)
    cells.push(<ShirtCell key="shirt" registration={registration} />);

  if ((role === "master" || role === "root") && isDetailedView)
    cells.push(<BillNrCell key="billNr" registration={registration} />);

  return <tr>{cells.map((cell) => cell)}</tr>;
};

RegistrationsTableEntry.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  registration: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default RegistrationsTableEntry;
