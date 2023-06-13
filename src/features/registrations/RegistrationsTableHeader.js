import { useSelector } from "react-redux";
import React from "react";
import { getRole } from "../userData/userDataSlice";
import { selectDetailView } from "./registrationsSlice";
import constants from "../../utils/constants";

const addCell = (list, text) => {
  list.push(<th key={text}>{text}</th>);
};

const RegistrationsTableHeader = () => {
  // const currentRole = useSelector(selectCurrentRole);
  const shiftRole = useSelector(getRole);
  const isDetailedView = useSelector(selectDetailView);

  const cells = [];
  let cellValues;

  if (isDetailedView) addCell(cells, "Reg. järg");

  addCell(cells, "Nimi");

  if (
    shiftRole !== constants.SHIFT_ROLE_BOSS &&
    shiftRole !== constants.SHIFT_ROLE_ROOT
  ) {
    cellValues = [];
    // No need to display registered status if one does not have permissions
    // to edit the registered status. The registered status can be inferred
    // from the table row group.
    cellValues.push("Vana?", "Vanus");
    if (isDetailedView) cellValues.push("Ts");
  } else {
    cellValues = [];
    if (isDetailedView) cellValues.push("Makstud", "Kokku", "Reg?");
    cellValues.push("Kontakt", "Meil", "Vana?", "Vanus");
    if (isDetailedView) cellValues.push("Ts", "Arve nr");
  }

  cellValues.map((value) => addCell(cells, value));

  return (
    <thead>
      <tr>{cells.map((cell) => cell)}</tr>
    </thead>
  );
};

export default RegistrationsTableHeader;
