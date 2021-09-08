import React from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { makePostRequest } from "./Common/requestAPI";

const fetchPDF = async ({ target }) => {
  const action = target.id;
  const email = document.getElementById("mail").value;

  const response = await makePostRequest(`bills/${action}/${email}/`);
  if (!response.ok) {
    return;
  }

  const obj = {
    filename: "arve.pdf",
    blob: await response.blob(),
  };
  const newBlob = new Blob([obj.blob], { type: "application/pdf" });
  const objUrl = window.URL.createObjectURL(newBlob);
  const link = document.createElement("a");
  link.href = objUrl;
  link.download = obj.filename;
  link.click();
  // const data = window.URL.createObjectURL(blob);
  // window.location.assign(data);
  // window.open(data);
  // window.location.assign(objUrl);
};

const BillGen = (props) => {
  const { title } = props;

  const dispatch = useDispatch();
  dispatch(setTitle(title));

  return (
    <div>
      <div className="c-card c-mailsend">
        <div className="c-mailsend-input">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="mail">Lapsevanema meil</label>
          <input type="email" name="meil" id="mail" />
        </div>
        <div className="c-mailsend-actions">
          <button type="button" id="fetch" onClick={fetchPDF}>
            Leia
          </button>
          <button type="button" id="create" onClick={fetchPDF}>
            Genereeri
          </button>
        </div>
      </div>
      <div className="o-banner o-banner--warning">
        <p>
          &bdquo;Genereeri&ldquo; asendab olemasoleva arve uuega (tänase
          kuupäevaga). Leia näitab viimast arvet.
        </p>
      </div>
    </div>
  );
};

BillGen.propTypes = {
  title: PropTypes.string.isRequired,
};

export default BillGen;
