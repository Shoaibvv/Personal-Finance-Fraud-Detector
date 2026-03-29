// src/index.js
// This is the entry point React uses to start the app.
// It finds the <div id="root"> in public/index.html and renders our App inside it.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Reset some browser default styles
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; }
`;
document.head.appendChild(globalStyle);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
