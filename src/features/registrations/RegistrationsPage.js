import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { makeGetRequest } from "../../components/Common/requestAPI";
import RegistrationsModule from "./RegistrationsModule";
import { selectCurrentShift, selectRole } from "../userAuth/userAuthSlice";
import { selectDetailView, setDetailView } from "./registrationsSlice";
import useDocumentTitle from "../../components/useDocumentTitle";
import constants from "../../utils/constants";

const shifts = [1, 2, 3, 4];

// Buttons used to switch between each of the shifts.
const ShiftSwitchButtons = ({ switcher, displayedShiftNr }) => {
  const dispatch = useDispatch();
  const displayedShiftRole = useSelector((state) =>
    selectRole(state, displayedShiftNr)
  );
  const isDetailedView = useSelector(selectDetailView);

  const print = async () => {
    const response = await makeGetRequest(
      `/registrations/pdf/${displayedShiftNr}`
    );
    if (!response || !response.ok) return;

    const obj = {
      filename: `${displayedShiftNr}v_nimekiri.pdf`,
      blob: await response.blob(),
    };

    const newBlob = new Blob([obj.blob], { type: "application/pdf" });
    const objUrl = window.URL.createObjectURL(newBlob);
    window.open(objUrl, "_blank");
  };

  const disablePrint =
    displayedShiftRole !== constants.SHIFT_ROLE_BOSS &&
    displayedShiftRole !== constants.SHIFT_ROLE_ROOT;

  const handleDetailView = ({ target }) => {
    dispatch(setDetailView(target.checked));
  };

  return (
    <div className="c-registrations-navigation">
      <div className="c-registrations-navbuttons">
        {shifts.map((shift) => (
          <button
            type="button"
            key={shift}
            onClick={switcher}
            className={`o-button--40${
              shift === displayedShiftNr ? " is-active" : ""
            }`}
          >
            {shift}v
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={print}
        disabled={disablePrint}
        className="o-button c-page-actions__button"
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
  displayedShiftNr: PropTypes.number.isRequired,
};

const RegistrationsPage = ({ title }) => {
  useDocumentTitle(title);

  // Start with the current shift but don't change the
  // display when the current shift is changed.
  const [shiftNr, setShiftNr] = useState(useSelector(selectCurrentShift));

  // Switch displayed shift.
  const switchShift = ({ target }) => {
    setShiftNr(parseInt(target.innerText[0], 10));
  };

  return (
    <div className="o-overflow-wrapper">
      <ShiftSwitchButtons switcher={switchShift} displayedShiftNr={shiftNr} />
      <RegistrationsModule shiftNr={shiftNr} />
    </div>
  );
};

RegistrationsPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default RegistrationsPage;
