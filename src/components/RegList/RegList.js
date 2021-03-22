import React, { Component } from "react";
import RegTable from "./Support Files/RegTable";

const shifts = ["1", "2", "3", "4"];
const regCounters = ["poisid", "tüdrukud", "kokku"];
const resCounters = ["res. poisid", "res. tüdrukud"];

const ShiftSwitchButtons = (props) => {
  return (
    <div className="c-regList-shiftBar">
      {shifts.map((shift) => (
        <button key={shift} onClick={props.switcher} className="o-button--40">
          {shift}v
        </button>
      ))}
    </div>
  );
};

const ShiftOverviewCounter = (props) => {
  const count = props.count ?? 0;
  return (
    <div className="c-regList-counter">
      {props.counterName}: <span className="u-mono">{count}</span>
    </div>
  );
};

const ShiftOverviewInfo = (props) => {
  return (
    <div className="c-regList-counters">
      <div className="c-regList-counters__reg">
        {regCounters.map((counter, index) => (
          <ShiftOverviewCounter
            counterName={counter}
            key={counter}
            count={props.regCounts[index]}
          />
        ))}
      </div>
      <div className="c-regList-counters__res">
        {resCounters.map((counter, index) => (
          <ShiftOverviewCounter
            counterName={counter}
            key={counter}
            count={props.resCounts[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default class RegList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shiftNr: 1,
      shiftData: {},
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });

    const credentials = localStorage.getItem("credentials");
    const accessToken = JSON.parse(credentials).accessToken;

    fetch("http://localhost:3000/api/reglist/fetch/", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          shiftData: data,
          isLoading: false,
        })
      );
  }

  shiftSwitcher = (e) => {
    this.setState({
      shiftNr: parseInt(e.target.innerText[0]),
    });
  };

  render() {
    const isLoading = this.state.isLoading;
    const shiftNr = this.state.shiftNr;
    const shiftData = this.state.shiftData[shiftNr];
    let regCounts, resCounts;
    regCounts = resCounts = 0;
    if (shiftData) {
      regCounts = [
        shiftData["regBoyCount"],
        shiftData["regGirlCount"],
        shiftData["totalCount"],
      ];
      resCounts = [shiftData["resBoyCount"], shiftData["resGirlCount"]];
    }
    return (
      <div>
        <ShiftSwitchButtons switcher={this.shiftSwitcher} />
        <ShiftOverviewInfo regCounts={regCounts} resCounts={resCounts} />
        <RegTable shiftData={shiftData} isLoading={isLoading} />
      </div>
    );
  }
}
