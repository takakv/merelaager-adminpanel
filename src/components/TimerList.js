import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { getShift } from "../features/userData/userDataSlice";
import {
  fetchCamperInfo,
  getCamperInfo,
} from "../features/camperInfo/camperInfoSlice";

const sort = (child1, child2) => child1.name.localeCompare(child2.name);

const ChildEntry = (props) => {
  const [trigger, setTrigger] = useState(false);
  const [time, setTime] = useState(3 * 60);
  const { name } = props;

  const getMinutes = (t) => Math.floor(t / 60);
  const getSeconds = (t) => t % 60;
  const zeroPad = (num, places) => String(num).padStart(places, "0");

  useEffect(() => {
    if (!trigger || time < 1) return;
    const timerID = setInterval(() => setTime(time - 1), 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(timerID);
    };
  });

  const triggerCd = () => setTrigger(!trigger);

  return (
    <div className="c-timer-entry">
      <div>{name}</div>
      <div className="c-timer-app">
        <div
          className={`c-timer-countdown u-mono${time === 0 ? " t-red" : ""}`}
        >
          {getMinutes(time)}:{zeroPad(getSeconds(time), 2)}
        </div>
        <button type="button" onClick={triggerCd}>
          {trigger ? "Stopp" : "Start"}
        </button>
      </div>
    </div>
  );
};

ChildEntry.propTypes = {
  name: PropTypes.string.isRequired,
};

const ChildList = (props) => {
  let { campers } = props;
  campers = Object.values(campers).sort(sort);
  return (
    <div>
      {campers.map((camper) => (
        <ChildEntry name={camper.name} key={camper.id} />
      ))}
    </div>
  );
};

ChildList.propTypes = {
  campers: PropTypes.objectOf(PropTypes.object).isRequired,
};

const TimerList = (props) => {
  const { title } = props;
  const shiftNr = useSelector(getShift);
  const dispatch = useDispatch();
  dispatch(setTitle(title));

  const camperInfo = useSelector(getCamperInfo);
  const infoStatus = useSelector((state) => state.camperInfo.status);
  const error = useSelector((state) => state.camperInfo.error);

  useEffect(() => {
    if (infoStatus === "idle") dispatch(fetchCamperInfo(shiftNr));
  }, [infoStatus, dispatch]);

  switch (infoStatus) {
    case "ok":
      return <ChildList campers={camperInfo} />;
    case "nok":
      return <p>{error}</p>;
    default:
      return <p>Laen...</p>;
  }
};

TimerList.propTypes = {
  title: PropTypes.string.isRequired,
};

export default TimerList;
