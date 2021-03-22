import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makePostRequest } from "./Common/requestAPI";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { fetchTents, getTents } from "../features/tents/tentsSlice";

// Populate the options dropdown for campers with a tent.
const tentNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

const TentList = (props) => {
  const dispatch = useDispatch();
  dispatch(setTitle(props.title));
  const shiftData = useSelector(getTents);
  const shiftStatus = useSelector((state) => state.tents.status);
  const error = useSelector((state) => state.tents.error);

  useEffect(() => {
    if (shiftStatus === "idle") dispatch(fetchTents());
  }, [shiftStatus, dispatch]);

  if (shiftStatus === "succeeded") {
    return (
      <div>
        <div className="c-tentless__container">
          {shiftData["noTentList"].map((camper) => (
            <NoTentCamper name={camper.name} key={camper.id} id={camper.id} />
          ))}
        </div>
        <div className="c-tent__container">
          {tentNumbers.map((tentNr) => (
            <TentBlock
              key={tentNr.toString()}
              tentNumber={tentNr}
              tentRoster={shiftData["tentList"][tentNr]}
            />
          ))}
        </div>
      </div>
    );
  } else if (shiftStatus === "failed") {
    return <p>{error}</p>;
  } else return <p>Laen...</p>;
};

export default TentList;

const NoTentCamper = (props) => {
  const addCamperToTent = async ({ target }) => {
    await makePostRequest("tents/update/" + `${props.id}/${target.value}/`);
  };

  return (
    <div className="c-tentless">
      <p>{props.name}</p>
      <label>
        <select name="tent" onChange={addCamperToTent}>
          <option value="0" style={{ color: "grey" }}>
            Telk
          </option>
          {tentNumbers.map((nr) => (
            <option value={nr} key={nr}>
              {nr}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

const TentBlock = (props) => {
  const [campers, setCampers] = useState(props.tentRoster);

  const handleChildUnmount = (index) => {
    setCampers((prevCampers) => {
      prevCampers.splice(index, 1);
      return [...prevCampers];
    });
  };

  return (
    <div className="c-tent">
      <p className="c-tent-header">{props.tentNumber}</p>
      <ul>
        {campers.map((camper, index) => (
          <TentBlockCamper
            camper={camper}
            key={camper.id}
            unmountMe={handleChildUnmount}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
};

const TentBlockCamper = (props) => {
  const removeCamperFromTent = async () => {
    await makePostRequest("tents/update/" + `${props.camper.id}/0/`);
    props.unmountMe(props.index);
  };

  return (
    <li className="u-list-blank c-tent-child">
      <span>{props.camper.name}</span>
      <div className="c-tent-child__rm" onClick={removeCamperFromTent}>
        <div />
      </div>
    </li>
  );
};
