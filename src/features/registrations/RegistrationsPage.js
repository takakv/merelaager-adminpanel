import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { setTitle } from "../pageTitle/pageTitleSlice";
import { makeGetRequest } from "../../components/Common/requestAPI";
import RegistrationsModule from "./RegistrationsModule";
import { getRole } from "../userData/userDataSlice";
import { selectCurrentShift } from "../userAuth/userAuthSlice";
import { selectDetailView, setDetailView } from "./registrationsSlice";

const shifts = [1, 2, 3, 4, 5];

// Buttons used to switch between each of the shifts.
const ShiftSwitchButtons = ({ switcher, shiftNr }) => {
  const dispatch = useDispatch();
  const role = useSelector(getRole);
  const isDetailedView = useSelector(selectDetailView);

  const print = async () => {
    const response = await makeGetRequest(`/registrations/pdf/${shiftNr}`);
    if (!response || !response.ok) return;

    const obj = {
      filename: `${shiftNr}v_nimekiri.pdf`,
      blob: await response.blob(),
    };

    const newBlob = new Blob([obj.blob], { type: "application/pdf" });
    const objUrl = window.URL.createObjectURL(newBlob);
    window.open(objUrl, "_blank");
  };

  const disablePrint = role !== "boss" && role !== "root";

  const handleDetailView = ({ target }) => {
    dispatch(setDetailView(target.checked));
  };

  return (
    <div className="c-regList-shiftBar">
      <div className="c-regList-shiftButtons">
        {shifts.map((shift) => (
          <button
            type="button"
            key={shift}
            onClick={switcher}
            className={`o-button--40${shift === shiftNr ? " is-active" : ""}`}
          >
            {shift}v
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={print}
        disabled={disablePrint}
      >
        Prindi
      </button>
      <div className="c-switcher-container">
        <input
          defaultChecked={isDetailedView}
          type="checkbox"
          id="switch"
          onChange={handleDetailView}
        />
        <label htmlFor="switch">
          <span className="c-switcher-title">Detailvaade</span>
          <span className="c-switcher-switch" />
        </label>
      </div>
    </div>
  );
};

ShiftSwitchButtons.propTypes = {
  switcher: PropTypes.func.isRequired,
  shiftNr: PropTypes.number.isRequired,
};

const RegistrationsPage = (props) => {
  const dispatch = useDispatch();

  const { title } = props;
  dispatch(setTitle(title));

  // Start with the current shift but don't change the
  // display when the current shift is changed.
  const [shiftNr, setShiftNr] = useState(useSelector(selectCurrentShift));

  // Switch displayed shift.
  const switchShift = ({ target }) => {
    setShiftNr(parseInt(target.innerText[0], 10));
  };

  return (
    <div className="o-overflow-wrapper">
      <ShiftSwitchButtons switcher={switchShift} shiftNr={shiftNr} />
      <RegistrationsModule shiftNr={shiftNr} />
    </div>
  );
};

RegistrationsPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default RegistrationsPage;
