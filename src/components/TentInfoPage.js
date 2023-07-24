import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useDocumentTitle from "./useDocumentTitle";
import {
  fetchTentInfo,
  selectTentInfo,
} from "../features/tentInfo/tentInfoSlice";

const TentInfoPage = () => {
  const { id } = useParams();
  useDocumentTitle(`Telk ${id}`);

  const dispatch = useDispatch();

  const camperInfo = useSelector(selectTentInfo);
  const infoStatus = useSelector((state) => state.tentInfo.status);
  const error = useSelector((state) => state.tentInfo.error);

  useEffect(() => {
    if (infoStatus === "idle") {
      dispatch(fetchTentInfo(id));
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
        <li>{camper}</li>
      ))}
    </ul>
  );
};

export default TentInfoPage;
