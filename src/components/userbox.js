import React, { Component } from "react";

export default class Userbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }

  componentDidMount() {
    const credentials = JSON.parse(localStorage.getItem("credentials"));
    this.setState({
      name: credentials.user.name,
    });
  }

  render() {
    return (
      <div className="admin-page__user">
        <span>{this.state.name}</span>
      </div>
    );
  }
}
