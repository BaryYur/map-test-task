import React from "react";
import ReactDOM from "react-dom/client";

import "mapbox-gl/dist/mapbox-gl.css";

import { QuestsContextProvider } from "./context";

import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QuestsContextProvider>
      <App />
    </QuestsContextProvider>
  </React.StrictMode>,
)
