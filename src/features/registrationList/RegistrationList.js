import React, { useState, useEffect } from "react";
import RegTable from "../../components/Support Files/RegTable";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../pageTitle/pageTitleSlice";
import {
  fetchRegistrationList,
  getAllRegistrationLists,
} from "./registrationListSlice";

const shifts = ["1", "2", "3", "4"];
const regCounters = ["poisid", "tüdrukud", "kokku"];
const resCounters = ["res. poisid", "res. tüdrukud"];

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

const ShiftOverviewCounter = (props) => {
  const count = props.count ?? 0;
  return (
    <div className="c-regList-counter">
      {props.counterName}: <span className="u-mono">{count}</span>
    </div>
  );
};

const ShiftOverviewInfo = (props) => {
  return (
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
  );
};

const RegistrationList = (props) => {
  const dispatch = useDispatch();
  dispatch(setTitle(props.title));

  const regListData = useSelector(getAllRegistrationLists);
  const regListStatus = useSelector((state) => state.registrationList.status);
  const regListError = useSelector((state) => state.registrationList.error);

  const [shiftNr, setShiftNr] = useState(1);

  useEffect(() => {
    if (regListStatus === "idle") dispatch(fetchRegistrationList());
  }, [regListStatus, dispatch]);

  const shiftSwitcher = ({ target }) => {
    setShiftNr(parseInt(target.innerText[0]));
  };

  let regCounts, resCounts;
  regCounts = resCounts = 0;
  let shiftData;

  if (regListStatus === "succeeded") {
    shiftData = regListData[shiftNr];
    if (shiftData) {
      regCounts = [
        shiftData["regBoyCount"],
        shiftData["regGirlCount"],
        shiftData["totalCount"],
      ];
      resCounts = [shiftData["resBoyCount"], shiftData["resGirlCount"]];
    }
  }

  const renderContent = (appendixContent) => {
    return (
      <div>
        <ShiftSwitchButtons switcher={shiftSwitcher} />
        <ShiftOverviewInfo regCounts={regCounts} resCounts={resCounts} />
        {appendixContent}
      </div>
    );
  };

  if (regListStatus === "succeeded") {
    const conditionalRenderContent = (
      <RegTable shiftData={shiftData} shiftNr={shiftNr} />
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
