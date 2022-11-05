import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchCamperInfo,
  selectAllCampersInfo,
} from "../features/camperInfo/camperInfoSlice";
import { set } from "../features/timer/timerSlice";
import { selectCurrentShift } from "../features/userAuth/userAuthSlice";
import useDocumentTitle from "./useDocumentTitle";

const displayTime = (t) => {
  const minutes = Math.floor(t / 1000 / 60);
  const seconds = t % 60;

  const zeroPad = (num, places) => String(num).padStart(places, "0");
  return `${minutes}:${zeroPad(seconds, 2)}`;
};

const ChildEntry = ({ name }) => {
  const length = useSelector((state) => state.timer.value);

  const startTime = new Date().getTime();
  const [endTime] = useState(startTime + length);

  const [trigger, setTrigger] = useState(false);
  const [, setStopped] = useState(true);
  const [time, setTime] = useState(length);

  useEffect(() => {
    setTime(length);
  }, [length]);

  useEffect(() => {
    if (!trigger) return;

    if (time < 1) {
      setTrigger(false);
      return;
    }

    console.log(startTime);
    // console.log(endTime - startTime);

    const timerID = setInterval(() => setTime(endTime - startTime), 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(timerID);
    };
  });

  const triggerCd = () => {
    setStopped(false);
    if (time === 0) setTime(length);
    setTrigger(!trigger);
  };

  const stop = () => {
    setTime(length);
    setTrigger(false);
    setStopped(true);
  };

  const handleKeyPress = (event, action) => {
    if (event.key !== "Enter") return;
    if (action === "toggle") triggerCd();
    else if (action === "stop") stop();
  };

  return (
    <div className="c-timer-entry">
      <div>{name}</div>
      <div className="c-timer-app">
        <div
          className={`c-timer-countdown u-mono${time === 0 ? " t-red" : ""}`}
        >
          {displayTime(time)}
        </div>
        <div className="c-timer-actions">
          <span
            className="c-timer-action material-icons-outlined"
            onClick={triggerCd}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyPress(e, "toggle")}
          >
            {trigger ? "pause" : "play_arrow"}
          </span>
          <span
            className="c-timer-action material-icons-outlined"
            onClick={stop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyPress(e, "stop")}
          >
            stop
          </span>
        </div>
      </div>
    </div>
  );
};

ChildEntry.propTypes = {
  name: PropTypes.string.isRequired,
  // stateChanger: PropTypes.func.isRequired,
};

const ChildList = () => {
  const dispatch = useDispatch();

  const camperInfo = useSelector(selectAllCampersInfo);
  const infoStatus = useSelector((state) => state.camperInfo.status);
  const error = useSelector((state) => state.camperInfo.error);

  const shiftNr = useSelector(selectCurrentShift);
  useEffect(() => {
    if (infoStatus === "idle") dispatch(fetchCamperInfo(shiftNr));
    console.log("Refreshing");
  }, [infoStatus, dispatch]);

  const campers = [];
  camperInfo.forEach((camper) => {
    campers.push(camper.name);
  });

  if (infoStatus === "ok") {
    return (
      <div>
        {campers.map((camper) => (
          <ChildEntry
            name={camper.name}
            key={camper.name}
            // stateChanger={stateChanger}
          />
        ))}
      </div>
    );
  }
  if (infoStatus === "nok") {
    return <p>{error}</p>;
  }
  return <p>Laen...</p>;
};

const TimerList = ({ title }) => {
  const dispatch = useDispatch();

  useDocumentTitle(title);

  const time = useSelector((state) => state.timer.value);

  const updateTime = ({ target }) => {
    const rawForm = target.value;
    const match = rawForm.match(/^\d{1,2}:\d{2}$/);
    if (!match) return;

    const minutes = parseInt(rawForm.match(/\d{1,2}:/), 10);
    const seconds = parseInt(rawForm.match(/:\d{2}/)[0].slice(1), 10);
    if (minutes >= 60 || seconds >= 60) return;

    dispatch(set((minutes * 60 + seconds) * 1000));
  };

  return (
    <div>
      <div className="o-infield">
        <div className="o-infield-input">
          <label htmlFor="timer">Aeg:</label>
          <input
            type="text"
            id="timer"
            defaultValue={displayTime(time)}
            onBlur={updateTime}
          />
        </div>
        <div className="o-infield-actions">
          <button type="button" className="o-button">
            Uuenda
          </button>
        </div>
      </div>
      <ChildList />
    </div>
  );
};

TimerList.propTypes = {
  title: PropTypes.string.isRequired,
};

export default TimerList;
