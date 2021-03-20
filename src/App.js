import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import PageTitle from "./components/PageTitle";
import Userbox from "./components/userbox";
import RegList from "./components/RegList/RegList";
import BillGen from "./components/BillGen";
import useToken from "./useToken";

export default function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />;
  }
  return (
    <div className="admin-page">
      <Sidebar />
      <PageTitle title="Ahoi" />
      <Userbox />
      <main role="main" className="c-content">
        <Switch>
          <Route path="/nimekiri/">
            <RegList />
          </Route>
          <Route path="/arvegeneraator/">
            <BillGen />
          </Route>
          <Route path="/telgid/"></Route>
        </Switch>
      </main>
    </div>
  );
}
