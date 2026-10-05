import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./theme/tokens.css";
import "./theme/calm-ledger.css";
import "./theme/night-vault.css";
import "./theme/fresh-mint.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
