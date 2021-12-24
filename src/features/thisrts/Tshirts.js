import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { setTitle } from "../pageTitle/pageTitleSlice";
import { fetchShirts, getShirts } from "./tshirtsSlice";

const ShirtCell = (props) => {
  const { shift, shirtData } = props;
  return (
    <div className="o-box">
      <p className="o-box-header u-text-center">{`${shift}v`}</p>
      <ul className="u-list-blank">
        {Object.entries(shirtData)
          .sort()
          .map((shirt) => (
            <li key={shirt[0]} className="u-flex u-space-between">
              <p>{shirt[0]}:</p>
              <p className="u-mono">{shirt[1]}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

ShirtCell.propTypes = {
  shift: PropTypes.number.isRequired,
  shirtData: PropTypes.objectOf(PropTypes.number).isRequired,
};

const TotalShirts = (props) => {
  const { shirtData } = props;
  return (
    <div className="o-box">
      <p className="o-box-header u-text-center">Kokku:</p>
      {Object.entries(shirtData)
        .sort()
        .map((shirt) => (
          <div key={shirt[0]} className="u-flex u-space-between">
            <p>{shirt[0]}:</p>
            <p className="u-mono">{shirt[1]}</p>
          </div>
        ))}
    </div>
  );
};

TotalShirts.propTypes = {
  shirtData: PropTypes.objectOf(PropTypes.number).isRequired,
};

const ShirtCells = ({ shirtData, shifts }) => (
  <div className="c-shirts-container u-flex">
    {shifts.map((shift) => (
      <ShirtCell key={shift} shift={shift} shirtData={shirtData[shift]} />
    ))}
    <TotalShirts shirtData={shirtData.total} />
  </div>
);

ShirtCells.propTypes = {
  shirtData: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number))
    .isRequired,
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

  const renderContent = (content) => <div>{content}</div>;

  let condContent;
  switch (fetchStatus) {
    case "ok":
      condContent = (
        <ShirtCells
          shirtData={shirtData}
          shifts={[...Array(Object.keys(shirtData).length).keys()].splice(1)}
        />
      );
      break;
    case "nok":
      condContent = <p>{fetchError}</p>;
      break;
    default:
      condContent = <p>Laen...</p>;
      break;
  }

  return renderContent(condContent);
};

export default Shirts;
