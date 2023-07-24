import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import useDocumentTitle from "./useDocumentTitle";
import {
  fetchTentInfo,
  selectTentInfo,
} from "../features/tentInfo/tentInfoSlice";
import { selectCurrentShift } from "../features/userAuth/userAuthSlice";
import { makePostRequest } from "./Common/requestAPI";

const TentMemberList = ({ tentNr }) => {
  const dispatch = useDispatch();

  const camperInfo = useSelector(selectTentInfo);
  const infoStatus = useSelector((state) => state.tentInfo.status);
  const error = useSelector((state) => state.tentInfo.error);

  useEffect(() => {
    if (infoStatus === "idle") {
      dispatch(fetchTentInfo(tentNr));
    }
  }, [infoStatus, dispatch]);

  if (infoStatus === "nok") {
    return <p>{error}</p>;
  }

  if (infoStatus === "idle") {
    return <p>Laen...</p>;
  }

  return (
    <ul>
      {camperInfo.map((camper) => (
        <li key={camper}>{camper}</li>
      ))}
    </ul>
  );
};

TentMemberList.propTypes = {
  tentNr: PropTypes.number.isRequired,
};

const TentInfoPage = () => {
  const { id } = useParams();
  const tentId = parseInt(id, 10);
  const shiftNr = useSelector(selectCurrentShift);

  useDocumentTitle(`Telk ${tentId}`);

  const [score, setScore] = useState(null);

  const updateScore = ({ target }) => {
    setScore(parseInt(target.value, 10));
  };

  const submitScore = async () => {
    await makePostRequest(`/tents/${tentId}`, { shiftNr, score }, true);
  };

  return (
    <>
      <TentMemberList tentNr={tentId} />
      <div className="c-card">
        <div className="o-infield">
          <div className="o-infield-input">
            <label htmlFor="score">Hinne (1–5)</label>
            <input
              type="number"
              name="score"
              id="score"
              min={1}
              max={5}
              onBlur={updateScore}
            />
          </div>
          <div className="o-infield-actions">
            <button
              type="button"
              className="o-button"
              id="send-score"
              onClick={() => submitScore()}
            >
              Hinda
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TentInfoPage;
