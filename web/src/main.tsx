import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/inter/index.css";
import "@fontsource/jetbrains-mono/index.css";
import App from "./components/App/App";
import applyPatches from "./utils/patches";
import "./utils/translation";

applyPatches();

const root = createRoot(document.getElementById("root"));

root.render(<App />);
