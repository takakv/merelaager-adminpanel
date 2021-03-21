import React, { Component } from "react";

const switchStatus = (target) => {
  const status = target.innerText;
  if (status === "ei") {
    target.innerText = "jah";
    // target.classList.remove("ei");
    // target.classList.add("jah");
  } else {
    target.innerText = "ei";
    // target.classList.remove("jah");
    // target.classList.add("ei");
  }
};

class RegTableHead extends Component {
  render() {
    return (
      <thead className="c-regList-table__head">
        <tr>
          <th>Reg ID</th>
          <th>Nimi</th>
          <th>Makstud</th>
          <th>Kogusumma</th>
          <th>Reg?</th>
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

class ToggleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
    };
  }

  toggleState = async (e) => {
    const credentials = localStorage.getItem("credentials");
    const accessToken = JSON.parse(credentials).accessToken;

    const response = await fetch(
      "http://localhost:3000/api/reglist/update/" +
        `${this.props.id}/${this.props.field}/`,
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
    } else {
      await this.setState({
        status: !this.state.status,
      });
      switchStatus(e.target);
    }
  };

  render() {
    return (
      <button className="o-button--40" onClick={this.toggleState}>
        {this.props.content}
      </button>
    );
  }
}

// TODO: Find a way to persist state.
class InputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  handleChange = async (e) => {
    await this.setState({
      value: e.target.value,
    });

    const credentials = localStorage.getItem("credentials");
    const accessToken = JSON.parse(credentials).accessToken;

    const response = await fetch(
      "http://localhost:3000/api/reglist/update/" +
        `${this.props.id}/${this.props.field}/${this.state.value}/`,
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
    }
  };

  render() {
    return (
      <input
        className={this.props.className}
        type="text"
        defaultValue={this.state.value}
        onBlur={this.handleChange}
      />
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
            <td>{kid.name}</td>
            <td>
              <InputField
                id={kid.id}
                field="total-paid"
                className="price"
                value={kid["pricePaid"]}
              />
            </td>
            <td>
              <InputField
                id={kid.id}
                field="total-due"
                className="priceToPay"
                value={kid["priceToPay"]}
              />
            </td>
            <td>
              <ToggleButton
                content={kid.registered}
                status={kid.registered === "jah"}
                id={kid.id}
                field="registration"
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
              <ToggleButton
                content={kid.isOld}
                status={kid.isOld === "jah"}
                id={kid.id}
                field="regular"
              />
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

export default class RegTable extends Component {
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
