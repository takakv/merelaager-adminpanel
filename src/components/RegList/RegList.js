import React, { Component } from "react";

class ShiftSwitchButtons extends Component {
  render() {
    const shifts = [];
    for (let i = 0; i < 4; ++i) shifts[i] = i + 1;
    return (
      <div className="c-regList-shiftBar">
        {shifts.map((shift) => (
          <button
            key={shift.toString()}
            onClick={this.props.switcher}
            className="o-button--40"
          >
            {shift}v
          </button>
        ))}
      </div>
    );
  }
}

class ShiftOverviewCounter extends Component {
  render() {
    let count = this.props.count ?? 0;
    return (
      <div className="c-regList-counter">
        {this.props.counterName}: <span className="u-mono">{count}</span>
      </div>
    );
  }
}

class ShiftOverviewInfo extends Component {
  render() {
    const regCounters = ["poisid", "tüdrukud", "kokku"];
    const resCounters = ["res. poisid", "res. tüdrukud"];
    return (
      <div className="c-regList-counters">
        <div className="c-regList-counters__reg">
          {regCounters.map((counter, index) => (
            <ShiftOverviewCounter
              counterName={counter}
              key={counter}
              count={this.props.regCounts[index]}
            />
          ))}
        </div>
        <div className="c-regList-counters__res">
          {resCounters.map((counter, index) => (
            <ShiftOverviewCounter
              counterName={counter}
              key={counter}
              count={this.props.resCounts[index]}
            />
          ))}
        </div>
      </div>
    );
  }
}

class RegTableHead extends Component {
  render() {
    return (
      <thead className="c-regList-table__head">
        <tr>
          <th>Reg ID</th>
          <th>Reg?</th>
          <th>Nimi</th>
          <th>Makstud</th>
          <th>Kogusumma</th>
          <th>Kontakt</th>
          <th>Vana?</th>
          <th>Sünnipäev</th>
          <th>Ts</th>
          <th>Tln?</th>
          <th>Arve nr</th>
          <th>Isikukood</th>
        </tr>
      </thead>
    );
  }
}

class RegTableSection extends Component {
  render() {
    return (
      <tbody>
        <tr>
          <td colSpan="14">{this.props.title}</td>
        </tr>
        {this.props.sectionData.map((kid) => (
          <tr key={kid.id}>
            <td className="u-mono">{kid.id}</td>
            <td>
              <button className="o-button--40">{kid.registered}</button>
            </td>
            <td>{kid.name}</td>
            <td>
              <input
                className="price"
                type="text"
                defaultValue={kid["pricePaid"]}
              />
            </td>
            <td>
              <input
                className="priceToPay"
                type="text"
                defaultValue={kid["priceToPay"]}
              />
            </td>
            <td id={`${kid.id}-contact`} className="c-camper-contact">
              <a
                href={`mailto:${kid["contactEmail"]}`}
                className="c-caper-contact__name"
              >
                {kid["contactName"]}
              </a>
              <span className="c-camper-contact__phone">
                {kid["contactNumber"]}
              </span>
            </td>
            <td>
              <button className="o-button--40">{kid["isOld"]}</button>
            </td>
            <td className="u-mono">{kid["bDay"]}</td>
            <td>{kid["tShirtSize"]}</td>
            <td>{kid["tln"]}</td>
            <td className="u-mono">{kid["billNr"]}</td>
            <td className="u-mono">{kid["idCode"]}</td>
          </tr>
        ))}
      </tbody>
    );
  }
}

class RegTable extends Component {
  render() {
    const listSections = [
      ["Poisid", "regBoys"],
      ["Tüdrukud", "regGirls"],
      ["Reserv poisid", "resBoys"],
      ["Reserv tüdrukud", "resGirls"],
    ];
    if (!this.props.shiftData) {
      return (
        <table>
          <RegTableHead />
        </table>
      );
    }
    return (
      <table className="c-regList-table">
        <RegTableHead />
        {listSections.map((section) => (
          <RegTableSection
            title={section[0]}
            sectionData={this.props.shiftData[section[1]]}
            key={section[1]}
          />
        ))}
      </table>
    );
  }
}

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

    let accessToken = localStorage.getItem("accessToken");
    accessToken = JSON.parse(accessToken).accessToken;

    fetch("http://localhost:3000/api/reglist/", {
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
