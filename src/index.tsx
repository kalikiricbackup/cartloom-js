import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { LoadingProvider } from "./contexts/LoadingContext";
import "./styles/global.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </React.StrictMode>,
);
