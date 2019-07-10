import React from "react";
import { Navigator } from "react-onsenui";

import "./App.css";
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";
// import "onsenui/css/material-design-iconic-font/css/material-design-iconic-font.min.css";

import GlobalProvider from "./js/contexts/GlobalProvider";
import Main from "./js/pages/Main";
import "./css/main.css";
import "./css/normalize.min.css";

const App = () => (
  <GlobalProvider>
    <Navigator
      initialRoute={{
        component: Main,
        props: { key: "main" }
      }}
      renderPage={(route, navigator) => {
        const props = route.props || {};
        props.navigator = navigator;
        return React.createElement(route.component, props);
      }}
    />
  </GlobalProvider>
);

export default App;
