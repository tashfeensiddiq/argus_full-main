import React from "react";
import { Router } from "react-router-dom";
import { render } from "react-dom";

import { history } from "./_helpers";
import { accountService } from "./_services";
import { App } from "./app/Index";
import { Provider } from "react-redux";
import configStore from "./_redux/configStore";
import "./styles.less";
// import "./index.css";
// setup fake backend
// import { configureFakeBackend } from './_helpers';
// configureFakeBackend();

// attempt silent token refresh before startup
accountService.refreshToken().finally(startApp);
const store = configStore();
function startApp() {
  render(
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>,

    document.getElementById("app")
  );
}
