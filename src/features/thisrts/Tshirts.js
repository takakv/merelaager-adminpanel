import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../pageTitle/pageTitleSlice";
import { fetchShirts, getShirts } from "./tshirtsSlice";

const shifts = ["1v", "2v", "3v", "4v"];

const ShirtCell = (props) => {
  return (
    <div className="c-shirtBox">
      <p className="c-shirtBox__title">{props.shift}</p>
      {Object.entries(props.shirtData).sort().map((shirt) => (
        <div key={shirt[0]} className="c-shirtCount">
          <p>{shirt[0]}:</p>
          <p className="u-mono">{shirt[1]}</p>
        </div>
      ))}
    </div>
  );
};

const ShirtCells = (props) => {
  return (
    <div className="c-shirtBox-container">
      {shifts.map((shift) => (
        <ShirtCell
          key={shift}
          shift={shift}
          shirtData={props.shirtData[shift]}
        />
      ))}
    </div>
  );
};

const Shirts = (props) => {
  const dispatch = useDispatch();

  dispatch(setTitle(props.title));

  const shirtData = useSelector(getShirts);
  const fetchStatus = useSelector((state) => state.shirts.status);
  const fetchError = useSelector((state) => state.shirts.error);

  // Each shift has separate T-shirt counters.
  useEffect(() => {
    if (fetchStatus === "idle") dispatch(fetchShirts());
  }, [fetchStatus, dispatch]);

  if (fetchStatus === "ok") {
  }

  const renderContent = (content) => {
    return <div>{content}</div>;
  };

  if (fetchStatus === "ok") {
    const condContent = <ShirtCells shirtData={shirtData} />;
    return renderContent(condContent);
  } else if (fetchStatus === "nok") {
    const condContent = <p>{fetchError}</p>;
    return renderContent(condContent);
  } else {
    const condContent = <p>Laen...</p>;
    return renderContent(condContent);
  }
};

export default Shirts;
