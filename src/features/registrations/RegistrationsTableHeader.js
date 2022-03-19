import { useSelector } from "react-redux";
import React from "react";
import { getRole } from "../userData/userDataSlice";

const addCell = (list, text) => {
  list.push(<th key={text}>{text}</th>);
};

const RegistrationsTableHeader = () => {
  const role = useSelector(getRole);

  const cells = [];
  let cellValues;

  addCell(cells, "Reg. järg");
  addCell(cells, "Nimi");

  if (role !== "boss" && role !== "root") {
    cellValues = ["Reg?", "Vana?", "Vanus", "Ts"];
  } else {
    cellValues = [
      "Makstud",
      "Kokku",
      "Reg?",
      "Kontakt",
      "Meil",
      "Vana?",
      "Vanus",
      "Ts",
      "Arve nr",
    ];
  }

  cellValues.map((value) => addCell(cells, value));

  return (
    <thead className="c-regList-table__head">
      <tr>{cells.map((cell) => cell)}</tr>
    </thead>
  );
};

export default RegistrationsTableHeader;
