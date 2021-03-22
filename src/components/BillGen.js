import React from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";

const fetchPDF = async ({ target }) => {
  const action = target.id;
  const email = document.getElementById("mail").value;

  const credentials = localStorage.getItem("credentials");
  const accessToken = JSON.parse(credentials).accessToken;

  const response = await fetch(
    "http://localhost:3000/api/bills/" + `${action}/${email}/`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (!response.ok) {
    window.alert(
      "Midagi läks nihu." +
        "\n\n" +
        `Veakood: ${response.status}` +
        "\n" +
        `Kirjeldus: ${response.statusText}`
    );
    console.log(response);
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
  const dispatch = useDispatch();
  dispatch(setTitle(props.title));

  return (
    <div>
      <label htmlFor="mail">Lapsevanema meil</label>
      <input type="email" name="meil" id="mail" />
      <button id="fetch" onClick={fetchPDF}>
        Leia
      </button>
      <button id="create" onClick={fetchPDF}>
        Genereeri
      </button>
      <div className="o-banner o-banner--warning">
        <p>
          "Genereeri" asendab olemasoleva arve uuega (tänase kuupäevaga). Leia
          näitab viimast arvet.
        </p>
      </div>
    </div>
  );
};

export default BillGen;
