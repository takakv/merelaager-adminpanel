import React, { useState } from "react";
import { makePostRequest } from "../Common/requestAPI";
import { useDispatch } from "react-redux";
import {
  updatePaidValue,
  updateToPayValue,
} from "../../features/registrationList/registrationListSlice";

const camperListSections = [
  ["Poisid", "regBoys"],
  ["Tüdrukud", "regGirls"],
  ["Reserv poisid", "resBoys"],
  ["Reserv tüdrukud", "resGirls"],
];

const switchStatus = (target) => {
  const status = target.innerText;
  if (status === "ei") {
    target.innerText = "jah";
    // target.classList.remove("ei");
    // target.classList.add("jah");
  } else {
    target.innerText = "ei";
    // target.classList.remove("jah");
    // target.classList.add("ei");
  }
};

const RegTableHead = () => {
  return (
    <thead className="c-regList-table__head">
      <tr>
        <th>Reg ID</th>
        <th>Nimi</th>
        <th>Makstud</th>
        <th>Kogusumma</th>
        <th>Reg?</th>
        <th>Kontakt</th>
        <th>Meil</th>
        <th>Vana?</th>
        <th>Sünnipäev</th>
        <th>Ts</th>
        <th>Tln?</th>
        <th>Arve nr</th>
        <th>Isikukood</th>
      </tr>
    </thead>
  );
};

const ToggleButton = (props) => {
  const [status, setStatus] = useState(props.status);

  const toggleState = async ({ target }) => {
    const response = await makePostRequest(
      "reglist/update/" + `${props.id}/${props.field}/`
    );
    if (response.ok) {
      setStatus((prevStatus) => !prevStatus);
      switchStatus(target);
    }
  };

  return (
    <button className="o-button--40" onClick={toggleState}>
      {props.status ? "jah" : "ei"}
    </button>
  );
};

const InputField = (props) => {
  const dispatch = useDispatch();

  const handleChange = async ({ target }) => {
    const response = await makePostRequest(
      "reglist/update/" + `${props.data.id}/${props.field}/${target.value}`
    );

    if (!response || !response.ok) return;

    if (props.field === "total-paid") {
      dispatch(
        updatePaidValue({
          shiftNr: props.shiftNr,
          camperData: props.data,
          value: parseInt(target.value),
        })
      );
    } else if (props.field === "total-due") {
      dispatch(
        updateToPayValue({
          shiftNr: props.shiftNr,
          camperData: props.data,
          value: parseInt(target.value),
        })
      );
    } else {
      const err = "Inconsistent API usage";
      alert(err);
      console.error(err);
    }
  };

  return (
    <input
      className={props.className}
      type="text"
      defaultValue={props.value}
      onBlur={handleChange}
    />
  );
};

const RegTableSection = (props) => {
  return (
    <tbody>
      <tr>
        <td colSpan="14">{props.title}</td>
      </tr>
      {props.sectionData.map((kid) => (
        <tr key={kid.id}>
          <td className="u-mono">{kid.id}</td>
          <td>{kid.name}</td>
          <td>
            <InputField
              data={kid}
              field="total-paid"
              className="price"
              shiftNr={props.shiftNr}
              value={kid["pricePaid"]}
            />
          </td>
          <td>
            <InputField
              data={kid}
              field="total-due"
              className="priceToPay"
              shiftNr={props.shiftNr}
              value={kid["priceToPay"]}
            />
          </td>
          <td>
            <ToggleButton
              status={kid.registered === "jah"}
              id={kid.id}
              field="registration"
            />
          </td>
          <td id={`${kid.id}-contact`} className="c-camper-contact">
            {kid["contactName"]}
            <span className="c-camper-contact__phone">
              {kid["contactNumber"]}
            </span>
          </td>
          <td>
            <a href={`mailto:${kid["contactEmail"]}`}>{kid["contactEmail"]}</a>
          </td>
          <td>
            <ToggleButton
              status={kid.isOld === "jah"}
              id={kid.id}
              field="regular"
            />
          </td>
          <td className="u-mono">{kid["bDay"]}</td>
          <td>{kid["tShirtSize"]}</td>
          <td>{kid["tln"]}</td>
          <td className="u-mono">{kid["billNr"]}</td>
          <td className="u-mono">{kid["idCode"]}</td>
        </tr>
      ))}
    </tbody>
  );
};

const RegTable = (props) => {
  if (!props.shiftData) {
    return (
      <table>
        <RegTableHead />
      </table>
    );
  }
  return (
    <table className="c-regList-table">
      <RegTableHead />
      {camperListSections.map((section) => (
        <RegTableSection
          title={section[0]}
          sectionData={props.shiftData[section[1]]}
          key={section[1]}
          shiftNr={props.shiftNr}
        />
      ))}
    </table>
  );
};

export default RegTable;
