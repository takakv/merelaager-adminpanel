import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import RegTable from "../../components/Support Files/RegTable";
import { setTitle } from "../pageTitle/pageTitleSlice";
import {
  fetchRegistrationList,
  getAllRegistrationLists,
} from "./registrationListSlice";
import { getShift } from "../userData/userDataSlice";
import { makeGetRequest } from "../../components/Common/requestAPI";

const shifts = ["1", "2", "3", "4", "5"];
const regCounters = ["poisid", "tüdrukud", "kokku"];
const resCounters = ["res. poisid", "res. tüdrukud"];

// Buttons used to switch between each of the shifts.
const ShiftSwitchButtons = ({ switcher }) => {
  const shiftNr = useSelector(getShift);

  const print = async () => {
    const response = await makeGetRequest(`reglist/print/${shiftNr}/`);
    if (!response || !response.ok) return;

    const obj = {
      filename: `${shiftNr}v_nimekiri.pdf`,
      blob: await response.blob(),
    };
    const newBlob = new Blob([obj.blob], { type: "application/pdf" });
    const objUrl = window.URL.createObjectURL(newBlob);
    // first method
    // const link = document.createElement("a");
    // link.href = objUrl;
    // link.target = "_blank";
    // link.download = obj.filename;
    // link.click();
    // second method
    window.open(objUrl, "_blank");
    // third method
    // let tab = window.open();
    // tab.location.href = objUrl;
  };

  return (
    <div className="c-regList-shiftBar">
      <div className="c-regList-shiftButtons">
        {shifts.map((shift) => (
          <button
            type="button"
            key={shift}
            onClick={switcher}
            className="o-button--40"
          >
            {shift}v
          </button>
        ))}
      </div>
      <button type="button" className="o-printer" onClick={print}>
        Prindi
      </button>
    </div>
  );
};

ShiftSwitchButtons.propTypes = {
  switcher: PropTypes.func.isRequired,
};

// Counters for shift data.
const ShiftOverviewCounter = (props) => {
  const { count, counterName } = props;

  return (
    <div className="c-regList-counter">
      {counterName}: <span className="u-mono">{count}</span>
    </div>
  );
};

ShiftOverviewCounter.propTypes = {
  count: PropTypes.number,
  counterName: PropTypes.string.isRequired,
};

ShiftOverviewCounter.defaultProps = {
  count: 0,
};

// Overview of the number of campers for each shift.
const ShiftOverviewInfo = ({ regCounts, resCounts }) => (
  <div className="c-regList-counters">
    <div className="c-regList-counters__reg">
      {regCounters.map((counter, index) => (
        <ShiftOverviewCounter
          counterName={counter}
          key={counter}
          count={regCounts[index]}
        />
      ))}
    </div>
    <div className="c-regList-counters__res">
      {resCounters.map((counter, index) => (
        <ShiftOverviewCounter
          counterName={counter}
          key={counter}
          count={resCounts[index]}
        />
      ))}
    </div>
  </div>
);

ShiftOverviewInfo.propTypes = {
  regCounts: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
  resCounts: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]).isRequired,
};

const RegistrationsList = (props) => {
  const registrations = useSelector(state => state.registrations);



  const dispatch = useDispatch();
  dispatch(setTitle(props.title));

  // Get the registration list for all shifts from the store.
  const regListData = useSelector(getAllRegistrationLists);
  // Get the status of fetching the registration list from the backend.
  const regListStatus = useSelector((state) => state.registrationList.status);
  const regListError = useSelector((state) => state.registrationList.error);

  const [shiftNr, setShiftNr] = useState(1);

  // Fetch all camper registration lists when the page has been rendered.
  useEffect(() => {
    if (regListStatus === "idle") dispatch(fetchRegistrationList());
  }, [regListStatus, dispatch]);

  // Update the active shift.
  const shiftSwitcher = ({ target }) => {
    setShiftNr(parseInt(target.innerText[0], 10));
  };

  let regCounts = 0;
  let resCounts = 0;
  let shiftData = null;

  if (regListStatus === "succeeded" && regListData) {
    shiftData = regListData[shiftNr];
    if (shiftData) {
      regCounts = [
        shiftData.regBoyCount,
        shiftData.regGirlCount,
        shiftData.totalRegCount,
      ];
      resCounts = [shiftData.resBoyCount, shiftData.resGirlCount];
    }
  }

  const renderContent = (appendixContent) => (
    <div>
      <ShiftSwitchButtons switcher={shiftSwitcher} />
      <ShiftOverviewInfo regCounts={regCounts} resCounts={resCounts} />
      {appendixContent}
    </div>
  );

  let conditionalRenderContent;
  switch (regListStatus) {
    case "succeeded":
      if (shiftData)
        conditionalRenderContent = (
          <RegTable shiftData={shiftData} shiftNr={shiftNr} />
        );
      else conditionalRenderContent = <p>Registreerimisi pole</p>;
      break;
    case "failed":
      conditionalRenderContent = <p>{regListError}</p>;
      break;
    default:
      conditionalRenderContent = <p>Laen...</p>;
      break;
  }

  return renderContent(conditionalRenderContent);
};

export default RegistrationsList;
