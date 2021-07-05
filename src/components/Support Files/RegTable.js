/* eslint-disable react/no-children-prop */
import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { makePostRequest } from "../Common/requestAPI";
import {
  removeCamper,
  toggleRegistration,
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

const RegTableHead = () => (
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

const ToggleButton = (props) => {
  const dispatch = useDispatch();

  const toggleState = async ({ target }) => {
    const response = await makePostRequest(
      `reglist/update/${props.id}/${props.field}/`
    );

    if (!response || !response.ok) return;

    switchStatus(target);

    // Update store.
    if (props.field === "registration") {
      dispatch(
        toggleRegistration({
          shiftNr: props.shiftNr,
          id: props.id,
          status: props.status,
        })
      );
    }
  };

  const { status } = props;

  return (
    <button type="button" className="o-button--40" onClick={toggleState}>
      {status ? "jah" : "ei"}
    </button>
  );
};

ToggleButton.propTypes = {
  id: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  shiftNr: PropTypes.number.isRequired,
  status: PropTypes.bool.isRequired,
};

const InputField = (props) => {
  const dispatch = useDispatch();

  const handleChange = async ({ target }) => {
    const response = await makePostRequest(
      `reglist/update/${props.id}/${props.field}/${target.value}`
    );

    if (!response || !response.ok) return;

    if (props.field === "total-paid") {
      dispatch(
        updatePaidValue({
          shiftNr: props.shiftNr,
          id: props.id,
          value: parseInt(target.value, 10),
        })
      );
    } else if (props.field === "total-due") {
      dispatch(
        updateToPayValue({
          shiftNr: props.shiftNr,
          id: props.id,
          value: parseInt(target.value, 10),
        })
      );
    } else {
      const err = "Inconsistent API usage";
      alert(err);
      console.error(err);
    }
  };

  const { className, value } = props;

  return (
    <input
      className={className}
      type="text"
      defaultValue={value}
      onBlur={handleChange}
    />
  );
};

InputField.propTypes = {
  id: PropTypes.number.isRequired,
  field: PropTypes.string.isRequired,
  shiftNr: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

const Deleter = (props) => {
  const dispatch = useDispatch();

  const remove = async () => {
    const response = await makePostRequest(`reglist/remove/${props.id}/`);
    if (!response || !response.ok) return;

    dispatch(
      removeCamper({
        shiftNr: props.shiftNr,
        id: props.id,
      })
    );
  };

  return (
    <button type="button" onClick={remove} className="c-regList-del">
      X
    </button>
  );
};

Deleter.propTypes = {
  shiftNr: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
};

const RegTableSection = (props) => {
  const { title, shiftNr } = props;
  const { children } = props;
  return (
    <tbody>
      <tr>
        <td colSpan="14">{title}</td>
      </tr>
      {children.map((kid) => (
        <tr key={kid.id}>
          <td className="u-mono u-relative">
            {kid.id}
            {kid.registered ? "" : <Deleter id={kid.id} shiftNr={shiftNr} />}
          </td>
          <td>{kid.name}</td>
          <td>
            <InputField
              shiftNr={shiftNr}
              id={kid.id}
              field="total-paid"
              className="price"
              value={kid.pricePaid}
            />
          </td>
          <td>
            <InputField
              shiftNr={shiftNr}
              id={kid.id}
              field="total-due"
              className="priceToPay"
              value={kid.priceToPay}
            />
          </td>
          <td>
            <ToggleButton
              shiftNr={shiftNr}
              id={kid.id}
              status={kid.registered}
              field="registration"
            />
          </td>
          <td id={`${kid.id}-contact`} className="c-camper-contact">
            {kid.contactName}, {kid.contactNr}
            {/* <span className="c-camper-contact__phone"> */}
            {/* </span> */}
          </td>
          <td>
            <a href={`mailto:${kid.contactEmail}`}>{kid.contactEmail}</a>
          </td>
          <td>
            <ToggleButton
              shiftNr={shiftNr}
              status={kid.isOld}
              id={kid.id}
              field="regular"
            />
          </td>
          <td className="u-mono">{kid.bDay}</td>
          <td>{kid.tShirtSize}</td>
          <td>{kid.tln ? "jah" : "ei"}</td>
          <td className="u-mono">{kid.billNr}</td>
          <td className="u-mono">{kid.idCode}</td>
        </tr>
      ))}
    </tbody>
  );
};

RegTableSection.propTypes = {
  title: PropTypes.string.isRequired,
  shiftNr: PropTypes.number.isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const RegTable = (props) => {
  // Store reformatted raw object data.
  const parsedData = {
    regBoys: [],
    regGirls: [],
    resBoys: [],
    resGirls: [],
  };

  const { shiftData } = props;

  // Convert object data into array format to be more manageable for React.
  Object.values(shiftData.campers).forEach((camper) => {
    if (camper.registered) {
      if (camper.gender === "Poiss") parsedData.regBoys.push(camper);
      else parsedData.regGirls.push(camper);
    } else if (camper.gender === "Poiss") parsedData.resBoys.push(camper);
    else parsedData.resGirls.push(camper);
  });

  if (!shiftData) {
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
          key={section[1]}
          title={section[0]}
          children={parsedData[section[1]]}
          shiftNr={props.shiftNr}
        />
      ))}
    </table>
  );
};

RegTable.propTypes = {
  shiftNr: PropTypes.number.isRequired,
  shiftData: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default RegTable;
