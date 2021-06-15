import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../pageTitle/pageTitleSlice";
import { fetchCamperInfo, getCamperInfo } from "./camperInfoSlice";
import { getShift } from "../userData/userDataSlice";
import { makeGetRequest, makePostRequest } from "../../components/Common/requestAPI";

const CamperEntry = (props) => {
  const handleChange = async ({target}) => {
    const packet = {notes: target.value}
    await makePostRequest(
      "/notes/update/" + `${props.data.id}/`,
      packet,
    );
  }

  return (
    <div className="o-box c-camper-info">
      <div className="o-box-header">
        <p>
          {props.data.name}, {props.data.gender === "M" ? "Poiss" : "Tüdruk"},
          Telk {props.data.tentNr ?? "-"}
        </p>
      </div>
      <div className="c-camper-info__content">
        <div className="c-info-block">
          <p className="title">Info</p>
          <div className="content">{props.data.parentNotes}</div>
        </div>
        <div className="c-info-block">
          <p className="title">Märkused</p>
          <textarea onBlur={handleChange} className="content" placeholder="..." defaultValue={props.data.notes}/>
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

  const print = async () => {
    const response = await makeGetRequest("notes/fetch/" + `${shiftNr}/`);
    if (!response || !response.ok) return;

    const blob = await response.blob();
    const newBlob = new Blob([blob], {type: "application/pdf"});
    const objUrl = window.URL.createObjectURL(newBlob);
    window.open(objUrl, "_blank");
  };

  switch (infoStatus) {
    case "ok":
      return (
        <div>
          <button onClick={print}>Prindi kõik</button>
          <p>Märkused töötavad ja salvestavad end ise.</p>
          {Object.values(camperInfo).map((camper) => (
            <CamperEntry key={camper.id} data={camper}/>
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
