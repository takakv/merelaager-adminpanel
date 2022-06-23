/* eslint-disable react/no-array-index-key */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { setTitle } from "../pageTitle/pageTitleSlice";
import { selectCurrentShift } from "../userAuth/userAuthSlice";
import {
  fetchCamperInfo,
  selectAllCampersInfo,
  updateCamperInfo,
} from "../camperInfo/camperInfoSlice";

// Populate the options dropdown for campers with a tent.
const tentNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

const TentsPage = (props) => {
  const shiftNr = useSelector(selectCurrentShift);
  const dispatch = useDispatch();

  const { title } = props;
  useEffect(() => {
    dispatch(setTitle(title));
  }, [title, dispatch]);

  const camperInfo = useSelector(selectAllCampersInfo);
  const infoStatus = useSelector((state) => state.camperInfo.status);
  const error = useSelector((state) => state.camperInfo.error);

  useEffect(() => {
    if (infoStatus === "idle") dispatch(fetchCamperInfo(shiftNr));
  }, [infoStatus, dispatch]);

  const tents = {};
  const noTent = { M: [], F: [] };

  const sortByName = (camper1, camper2) => {
    if (camper1.name === camper2.name) return 0;
    if (camper1.name > camper2.name) return 1;
    return -1;
  };

  tentNumbers.forEach((nr) => {
    tents[nr] = [];
  });

  if (infoStatus === "ok") {
    camperInfo.forEach((camper) => {
      if (camper.tentNr) tents[camper.tentNr].push(camper);
      else noTent[camper.gender].push(camper);
    });

    noTent.M.sort(sortByName);
    noTent.F.sort(sortByName);

    const entryGenerator = (camper) => (
      <NoTentCamper
        key={camper.childId}
        id={camper.childId}
        name={camper.name}
      />
    );

    const boxGenerator = (gender) => (
      <div className="o-box c-tentless-box">
        <div className="o-box-header">
          {gender === "M" ? "Poisid" : "Tüdrukud"}
        </div>
        <div className="c-tentless-box__content">
          {noTent[gender].map(entryGenerator)}
        </div>
      </div>
    );

    return (
      <div>
        <div className="c-tentless-container">
          {noTent.M.length ? boxGenerator("M") : ""}
          {noTent.F.length ? boxGenerator("F") : ""}
        </div>
        <p>Märkeruut näitab, kas laps on laagris kohal.</p>
        <div className="u-flex u-flex-wrap">
          {Object.values(tents).map((tent, index) => (
            <TentBlock
              key={index.toString()}
              tentMembers={tent}
              tentNumber={index}
            />
          ))}
        </div>
      </div>
    );
  }
  if (infoStatus === "nok") {
    return <p>{error}</p>;
  }
  return <p>Laen...</p>;
};

TentsPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default TentsPage;

const NoTentCamper = (props) => {
  const { name, id } = props;
  const dispatch = useDispatch();

  const addCamperToTent = async ({ target }) => {
    const field = "tentNr";
    const reqObj = { id, field, data: {} };

    const tentNr = parseInt(target.value, 10);
    if (isNaN(tentNr) || tentNr < 1 || tentNr > 10) return;

    reqObj.data[field] = tentNr;
    dispatch(updateCamperInfo(reqObj));
  };

  return (
    <div className="c-tentless">
      <p>{name}</p>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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

NoTentCamper.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

const TentBlock = (props) => {
  const { tentMembers, tentNumber } = props;
  return (
    <div className="c-tent o-box">
      <h3 className="o-box-header u-text-center">{tentNumber + 1}</h3>
      <ul className="u-list-blank">
        {tentMembers.map((camper) => (
          <TentBlockCamper
            camper={camper}
            key={camper.childId}
            tentNumber={tentNumber}
          />
        ))}
      </ul>
    </div>
  );
};

TentBlock.propTypes = {
  tentMembers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  tentNumber: PropTypes.number.isRequired,
};

const TentBlockCamper = (props) => {
  const { camper } = props;
  const dispatch = useDispatch();

  const id = camper.childId;

  const removeCamperFromTent = async () => {
    const field = "tentNr";
    const reqObj = { id, field, data: {} };

    reqObj.data[field] = null;
    dispatch(updateCamperInfo(reqObj));
  };

  const togglePresence = async ({ target }) => {
    const field = "isPresent";
    const reqObj = { id, field, data: {} };

    reqObj.data[field] = target.checked;
    dispatch(updateCamperInfo(reqObj));
  };

  return (
    <li className="u-flex u-space-between u-align-center">
      <span>{camper.name}</span>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className="c-tent-side">
        <input
          className="c-tent-presence"
          type="checkbox"
          defaultChecked={camper.isPresent}
          onChange={togglePresence}
        />
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <div
          role="button"
          className="c-tent-rm"
          onClick={removeCamperFromTent}
          tabIndex={0}
        >
          <div />
        </div>
      </div>
    </li>
  );
};

TentBlockCamper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  camper: PropTypes.objectOf(PropTypes.any).isRequired,
};
