import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "@fontsource/inter/index.css";
import App from "./components/App";
import applyPatches from "./utils/patches";
import "./utils/translation";

applyPatches();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
