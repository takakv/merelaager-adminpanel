import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import {
  fetchCamperInfo,
  selectAllCampersInfo,
} from "../features/camperInfo/camperInfoSlice";
import { set } from "../features/timer/timerSlice";
import { selectCurrentShift } from "../features/userAuth/userAuthSlice";

const sort = (child1, child2) => child1.name.localeCompare(child2.name);

const displayTime = (t) => {
  const minutes = Math.floor(t / 60);
  const seconds = t % 60;

  const zeroPad = (num, places) => String(num).padStart(places, "0");
  return `${minutes}:${zeroPad(seconds, 2)}`;
};

const ChildEntry = (props) => {
  const length = useSelector((state) => state.timer.value);

  const [trigger, setTrigger] = useState(false);
  const [, setStopped] = useState(true);
  const [time, setTime] = useState(length);
  const { name } = props;

  useEffect(() => {
    setTime(length);
  }, [length]);

  useEffect(() => {
    if (!trigger) return;

    if (time < 1) {
      setTrigger(false);
      return;
    }

    const timerID = setInterval(() => setTime(time - 1), 1000);

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
};

const ChildList = (props) => {
  let { campers } = props;
  campers = Object.values(campers).sort(sort);

  return (
    <div>
      {campers.map((camper) => (
        <ChildEntry name={camper.name} key={camper.childId} />
      ))}
    </div>
  );
};

ChildList.propTypes = {
  campers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

const TimerList = (props) => {
  const dispatch = useDispatch();

  const { title } = props;
  useEffect(() => {
    dispatch(setTitle(title));
  }, [title, dispatch]);

  const camperInfo = useSelector(selectAllCampersInfo);
  const infoStatus = useSelector((state) => state.camperInfo.status);
  const error = useSelector((state) => state.camperInfo.error);

  const shiftNr = useSelector(selectCurrentShift);
  useEffect(() => {
    if (infoStatus === "idle") dispatch(fetchCamperInfo(shiftNr));
  }, [infoStatus, dispatch]);

  const time = useSelector((state) => state.timer.value);

  const updateTime = ({ target }) => {
    const rawForm = target.value;
    const match = rawForm.match(/^\d{1,2}:\d{2}$/);
    if (!match) return;

    const minutes = parseInt(rawForm.match(/\d{1,2}:/), 10);
    const seconds = parseInt(rawForm.match(/:\d{2}/)[0].slice(1), 10);
    if (minutes >= 60 || seconds >= 60) return;

    dispatch(set(minutes * 60 + seconds));
  };

  switch (infoStatus) {
    case "ok":
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
          <ChildList campers={camperInfo} />
        </div>
      );
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
