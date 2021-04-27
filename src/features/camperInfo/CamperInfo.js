import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../pageTitle/pageTitleSlice";
import { fetchCamperInfo, getCamperInfo } from "./camperInfoSlice";
import { getShift } from "../userData/userDataSlice";

const CamperEntry = (props) => {
  return (
    <div className="c-camper-info">
      <div className="c-camper-info__header">
        <p>
          {props.data.name}, {props.data.gender === "M" ? "Poiss" : "Tüdruk"},
          Telk {props.data.tentNr ?? "-"}
        </p>
      </div>
      <div className="c-camper-info__content">
        <div className="c-info-block">
          <div className="title">Info</div>
          <div className="content">{props.data.parentNotes}</div>
        </div>
        <div className="c-info-block">
          <div className="title">Märkused</div>
          <textarea className="content" defaultValue={props.data.notes} />
        </div>
      </div>
    </div>
  );
};

const CamperInfo = (props) => {
  const shiftNr = useSelector(getShift);
  const dispatch = useDispatch();
  dispatch(setTitle(props.title));

  const camperInfo = useSelector(getCamperInfo);
  const infoStatus = useSelector((state) => state.camperInfo.status);
  const error = useSelector((state) => state.camperInfo.error);

  useEffect(() => {
    if (infoStatus === "idle") dispatch(fetchCamperInfo(shiftNr));
  }, [infoStatus, dispatch]);

  switch (infoStatus) {
    case "ok":
      return (
        <div>
          <p>Märkused veel ei tööta.</p>
          {Object.values(camperInfo).map((camper) => (
            <CamperEntry key={camper.key} data={camper} />
          ))}
        </div>
      );
    case "nok":
      return <p>{error}</p>;
    default:
      return <p>Laen...</p>;
  }
};

export default CamperInfo;
