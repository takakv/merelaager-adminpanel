import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useDocumentTitle from "./useDocumentTitle";
import {
  fetchTentInfo,
  selectTentInfo,
} from "../features/tentInfo/tentInfoSlice";
import { selectCurrentShift } from "../features/userAuth/userAuthSlice";
import { makePostRequest } from "./Common/requestAPI";

const TentMemberList = () => {
  const tentInfo = useSelector(selectTentInfo);
  const infoStatus = useSelector((state) => state.tentInfo.status);
  const error = useSelector((state) => state.tentInfo.error);

  if (infoStatus === "nok") {
    return <p>{error}</p>;
  }

  if (infoStatus === "idle") {
    return <p>Laen...</p>;
  }

  return (
    <ul>
      {tentInfo.names.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};

const GradesList = () => {
  const tentInfo = useSelector(selectTentInfo);
  const infoStatus = useSelector((state) => state.tentInfo.status);
  const error = useSelector((state) => state.tentInfo.error);

  if (infoStatus === "nok") {
    return <p>{error}</p>;
  }

  if (infoStatus === "idle") {
    return <p>Laen...</p>;
  }

  return (
    <ul>
      {tentInfo.grades.map((grade) => {
        const date = new Date(grade.date);
        const dateOptions = {
          month: "2-digit",
          day: "2-digit",
        };
        const strDate = date.toLocaleDateString("et", dateOptions);

        return (
          <li key={grade.date}>
            {grade.score} ({strDate})
          </li>
        );
      })}
    </ul>
  );
};

const TentInfoPage = () => {
  const { id } = useParams();
  const tentId = parseInt(id, 10);
  const shiftNr = useSelector(selectCurrentShift);
  const dispatch = useDispatch();

  useDocumentTitle(`Telk ${tentId}`);

  const infoStatus = useSelector((state) => state.tentInfo.status);
  useEffect(() => {
    if (infoStatus === "idle") {
      dispatch(fetchTentInfo(tentId));
    }
  }, [infoStatus, dispatch]);

  const [score, setScore] = useState("");
  const ref = useRef(null);

  const updateScore = ({ target }) => {
    const newScore = parseInt(target.value, 10);
    if (isNaN(newScore) || newScore < 1 || newScore > 10) {
      setScore("");
      return;
    }
    setScore(newScore.toString());
  };

  const submitScore = async () => {
    await makePostRequest(`/tents/${tentId}`, { shiftNr, score }, true);
    alert(`Hinnatud: hinne ${score}`);
    setScore("");
  };

  return (
    <>
      <b>Liikmed:</b>
      <TentMemberList />
      <br />
      <b>Hinded:</b>
      <GradesList />
      <br />
      <b>Hinda:</b>
      <br />
      <div className="c-card">
        <div className="o-infield">
          <div className="o-infield-input">
            <label htmlFor="score">Hinne (1–10)</label>
            <input
              ref={ref}
              value={score}
              type="number"
              name="score"
              id="score"
              min={1}
              max={10}
              onInput={updateScore}
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
      <br />
      <br />
      {tentId > 1 && (
        <Link
          to={`../telgid/${tentId - 1}`}
          type="button"
          className="o-button c-tent-button"
        >
          {tentId - 1} telk
        </Link>
      )}
      {tentId < 10 && (
        <Link
          to={`../telgid/${tentId + 1}`}
          type="button c-tent-button"
          className="o-button c-page-actions__button"
        >
          {tentId + 1} telk
        </Link>
      )}
    </>
  );
};

export default TentInfoPage;
