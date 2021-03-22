import React, { Component } from "react";
import { fetchAccessToken } from "./Common/tokens";
import { promptRequestError } from "./Common/errors";

// Populate the options dropdown for campers with a tent.
const tentNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

export default class TentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shiftNr: 2,
      shiftData: {},
      isLoading: true,
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/tents/fetch/" + `${this.state.shiftNr}/`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + fetchAccessToken(),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          shiftData: data,
          isLoading: false,
        });
      });
  }

  render() {
    const isLoading = this.state.isLoading;
    if (!isLoading) console.log(this.state.shiftData);
    if (isLoading) {
      return <p>Laen...</p>;
    }
    return (
      <div>
        <div className="c-tentless__container">
          {this.state.shiftData["noTentList"].map((camper) => (
            <NoTentCamper name={camper.name} key={camper.id} />
          ))}
        </div>
        <div className="c-tent__container"></div>
      </div>
    );
  }
}

const NoTentCamper = (props) => {
  const addCamperToTent = async ({ target }) => {
    const credentials = localStorage.getItem("credentials");
    const accessToken = JSON.parse(credentials).accessToken;

    const response = await fetch(
      "http://localhost:3000/api/tents/update/" +
        `${props.id}/${target.value}/`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    if (!response.ok) promptRequestError(response);
    else {
      console.log("Ok");
    }
  };

  return (
    <div id={props.id} className="c-tentless">
      <p>{props.name}</p>
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

class TentBlock extends Component {}
