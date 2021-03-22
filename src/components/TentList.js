import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAccessToken } from "./Common/tokens";
import { makePostRequest } from "./Common/requestAPI";
import { setTitle } from "../features/pageTitle/pageTitleSlice";

// Populate the options dropdown for campers with a tent.
const tentNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

const TentList = () => {
  const dispatch = useDispatch();
  dispatch(setTitle("Telgid"));

  const shiftNr = 2;
  const [shiftData, setShiftData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/tents/fetch/" + `${shiftNr}/`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + fetchAccessToken(),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShiftData(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Laen...</p>;
  }
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
