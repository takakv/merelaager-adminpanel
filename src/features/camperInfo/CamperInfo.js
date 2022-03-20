import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { setTitle } from "../pageTitle/pageTitleSlice";
import { fetchCamperInfo, getCamperInfo } from "./camperInfoSlice";
import {
  makeGetRequest,
  makePostRequest,
} from "../../components/Common/requestAPI";
import { selectCurrentShift } from "../userAuth/userAuthSlice";

const CamperEntry = (props) => {
  const { data, shiftNr } = props;

  const handleChange = async ({ target }) => {
    const packet = { notes: target.value };
    await makePostRequest(`/notes/update/${data.id}/`, packet);
  };

  const print = async () => {
    const response = await makeGetRequest(`notes/fetch/${shiftNr}/${data.id}/`);
    if (!response || !response.ok) return;

    const blob = await response.blob();
    const newBlob = new Blob([blob], { type: "application/pdf" });
    const objUrl = window.URL.createObjectURL(newBlob);
    window.open(objUrl, "_blank");
  };

  return (
    <div className="o-box c-camper-info">
      <div className="o-box-header">
        <div className="u-flex u-space-between">
          <p>
            {data.name}, {data.gender === "M" ? "Poiss" : "Tüdruk"}, Telk{" "}
            {data.tentNr ?? "-"}
          </p>
          <button type="button" className="o-printer" onClick={print}>
            Prindi
          </button>
        </div>
      </div>
      <div className="c-camper-info__content">
        <div className="c-info-block">
          <p className="title">Info</p>
          <div className="content">{data.parentNotes}</div>
        </div>
        <div className="c-info-block">
          <p className="title">Märkused</p>
          <textarea
            onBlur={handleChange}
            className="content"
            placeholder="..."
            defaultValue={data.notes}
          />
        </div>
      </div>
    </div>
  );
};

CamperEntry.propTypes = {
  shiftNr: PropTypes.number.isRequired,
  // figure out why later
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

const CamperInfo = (props) => {
  const { title } = props;
  const shiftNr = useSelector(selectCurrentShift);
  const dispatch = useDispatch();
  dispatch(setTitle(title));

  const camperInfo = useSelector(getCamperInfo);
  const infoStatus = useSelector((state) => state.camperInfo.status);
  const error = useSelector((state) => state.camperInfo.error);

  useEffect(() => {
    if (infoStatus === "idle") dispatch(fetchCamperInfo(shiftNr));
  }, [infoStatus, dispatch]);

  const print = async () => {
    document.body.style.cursor = "wait";
    const response = await makeGetRequest(`notes/fetch/${shiftNr}/`);
    if (!response || !response.ok) {
      document.body.style.cursor = "";
      return;
    }

    const blob = await response.blob();
    const newBlob = new Blob([blob], { type: "application/pdf" });
    const objUrl = window.URL.createObjectURL(newBlob);
    window.open(objUrl, "_blank");
    document.body.style.cursor = "";
  };

  switch (infoStatus) {
    case "ok":
      return (
        <div>
          <button type="button" className="o-printer" onClick={print}>
            Prindi kõik
          </button>
          <p>Märkused säilivad läbi aastate ja vahetuste.</p>
          {Object.values(camperInfo).map((camper) => (
            <CamperEntry key={camper.id} data={camper} shiftNr={shiftNr} />
          ))}
        </div>
      );
    case "nok":
      return <p>{error}</p>;
    default:
      return <p>Laen...</p>;
  }
};

CamperInfo.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CamperInfo;
