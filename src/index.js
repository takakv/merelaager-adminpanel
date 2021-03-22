import React from "react";
import ReactDOM from "react-dom";
import App from "./app/App";
import "./app.scss";
import store from "./app/store";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);
