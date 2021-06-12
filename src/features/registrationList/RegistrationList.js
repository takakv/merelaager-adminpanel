import React, { useEffect, useState } from "react";
import RegTable from "../../components/Support Files/RegTable";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../pageTitle/pageTitleSlice";
import { fetchRegistrationList, getAllRegistrationLists, } from "./registrationListSlice";
import { getShift } from "../userData/userDataSlice";
import { makeGetRequest } from "../../components/Common/requestAPI";

const shifts = ["1", "2", "3", "4"];
const regCounters = ["poisid", "tüdrukud", "kokku"];
const resCounters = ["res. poisid", "res. tüdrukud"];

// Buttons used to switch between each of the shifts.
const ShiftSwitchButtons = (props) => {
  return (
    <div className="c-regList-shiftBar">
      {shifts.map((shift) => (
        <button key={shift} onClick={props.switcher} className="o-button--40">
          {shift}v
        </button>
      ))}
    </div>
  );
};

// Counters for shift data.
const ShiftOverviewCounter = (props) => {
  const count = props.count ?? 0;
  return (
    <div className="c-regList-counter">
      {props.counterName}: <span className="u-mono">{count}</span>
    </div>
  );
};

// Overview of the number of campers for each shift.
const ShiftOverviewInfo = (props) => {
  const shiftNr = useSelector(getShift);

  const print = async () => {
    const response = await makeGetRequest("reglist/print/" + `${shiftNr}/`);
    if (!response || !response.ok) return;

    const obj = {
      filename: `${shiftNr}v_nimekiri.pdf`,
      blob: await response.blob(),
    };
    const newBlob = new Blob([obj.blob], {type: "application/pdf"});
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
  }

  return (
    <div>
      <div className="c-regList-counters">
        <div className="c-regList-counters__reg">
          {regCounters.map((counter, index) => (
            <ShiftOverviewCounter
              counterName={counter}
              key={counter}
              count={props.regCounts[index]}
            />
          ))}
        </div>
        <div className="c-regList-counters__res">
          {resCounters.map((counter, index) => (
            <ShiftOverviewCounter
              counterName={counter}
              key={counter}
              count={props.resCounts[index]}
            />
          ))}
        </div>
      </div>
      <button onClick={print}>Prindi</button>
    </div>
  );
};

const RegistrationList = (props) => {
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
  const shiftSwitcher = ({target}) => {
    setShiftNr(parseInt(target.innerText[0]));
  };

  let regCounts, resCounts;
  regCounts = resCounts = 0;
  let shiftData = null;

  if (regListStatus === "succeeded") {
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

  const renderContent = (appendixContent) => {
    return (
      <div>
        <ShiftSwitchButtons switcher={shiftSwitcher}/>
        <ShiftOverviewInfo regCounts={regCounts} resCounts={resCounts}/>
        {appendixContent}
      </div>
    );
  };

  if (regListStatus === "succeeded") {
    const conditionalRenderContent = (
      <RegTable shiftData={shiftData} shiftNr={shiftNr}/>
    );
    return renderContent(conditionalRenderContent);
  } else if (regListStatus === "failed") {
    const conditionalRenderContent = <p>{regListError}</p>;
    return renderContent(conditionalRenderContent);
  } else {
    const conditionalRenderContent = <p>Laen...</p>;
    return renderContent(conditionalRenderContent);
  }
};

export default RegistrationList;
