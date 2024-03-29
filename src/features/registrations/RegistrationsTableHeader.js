import { useSelector } from "react-redux";
import React from "react";
import { getRole } from "../userData/userDataSlice";
import { selectDetailView } from "./registrationsSlice";

const addCell = (list, text) => {
  list.push(<th key={text}>{text}</th>);
};

const RegistrationsTableHeader = () => {
  // const currentRole = useSelector(selectCurrentRole);
  const role = useSelector(getRole);
  const isDetailedView = useSelector(selectDetailView);

  const cells = [];
  let cellValues;

  if (isDetailedView) addCell(cells, "Reg. järg");

  addCell(cells, "Nimi");

  if (role !== "master" && role !== "root") {
    cellValues = [];
    if (isDetailedView) cellValues.push("Reg?");
    cellValues.push("Reg?", "Vana?", "Vanus", "Ts");
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
