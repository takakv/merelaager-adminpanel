import React, { useState } from "react";
import PropTypes from "prop-types";

import { makeGetRequest } from "./Common/requestAPI";
import useDocumentTitle from "./useDocumentTitle";

const fetchPDF = async (action, email) => {
  const response = await makeGetRequest(`/bills/${action}/${email}`);
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

const BillGen = ({ title }) => {
  const [email, setEmail] = useState();

  useDocumentTitle(title);

  const updateEmail = ({ target }) => {
    setEmail(target.value);
  };

  const getPDF = async ({ target }) => {
    const action = target.id;
    if (email) await fetchPDF(action, email);
  };

  return (
    <div>
      <div className="c-card c-mailsend">
        <div className="o-infield">
          <div className="o-infield-input">
            <label htmlFor="email">Lapsevanema meil</label>
            <input type="email" name="meil" id="email" onBlur={updateEmail} />
          </div>
          <div className="o-infield-actions">
            <button
              type="button"
              className="o-button"
              id="fetch"
              onClick={getPDF}
            >
              Leia
            </button>
            <button
              type="button"
              className="o-button"
              id="create"
              onClick={getPDF}
            >
              Genereeri
            </button>
          </div>
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
