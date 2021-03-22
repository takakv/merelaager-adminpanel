import React, { Component, useState } from "react";
import { fetchAccessToken } from "./Common/tokens";
import { makePostRequest } from "./Common/requestAPI";

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
    if (isLoading) {
      return <p>Laen...</p>;
    }
    return (
      <div>
        <div className="c-tentless__container">
          {this.state.shiftData["noTentList"].map((camper) => (
            <NoTentCamper name={camper.name} key={camper.id} id={camper.id} />
          ))}
        </div>
        <div className="c-tent__container">
          {tentNumbers.map((tentNr) => (
            <TentBlock
              key={tentNr.toString()}
              tentNumber={tentNr}
              tentRoster={this.state.shiftData["tentList"][tentNr]}
            />
          ))}
        </div>
      </div>
    );
  }
}

const NoTentCamper = (props) => {
  const addCamperToTent = async ({ target }) => {
    await makePostRequest("tents/update/" + `${props.id}/${target.value}/`);
  };

  return (
    <div className="c-tentless">
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

// The state doesn't get updated when it should. Most likely this is due
// to some Babel optimisations. Should file a bug report when I feel like it.
const TentBlock = (props) => {
  const [campers, setCampers] = useState(props.tentRoster);

  const handleChildUnmount = (index) => {
    setCampers([...campers.splice(index, 1)]);
  };

  return (
    <div className="c-tent">
      <p className="c-tent-header">{props.tentNumber}</p>
      <ul>
        {campers.map((camper, index) => (
          <TentBlockCamper
            camper={camper}
            key={camper.id}
            unmountMe={handleChildUnmount}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
};

const TentBlockCamper = (props) => {
  const [isAssigned, setIsAssigned] = useState(true);

  const removeCamperFromTent = async () => {
    await makePostRequest("tents/update/" + `${props.camper.id}/0/`);
    setIsAssigned(false);
    // props.unmountMe(props.index);
  };

  let entry = "";
  if (isAssigned)
    entry = (
      <li className="u-list-blank c-tent-child">
        <span>{props.camper.name}</span>
        <div className="c-tent-child__rm" onClick={removeCamperFromTent}>
          <div />
        </div>
      </li>
    );

  return entry;
};
