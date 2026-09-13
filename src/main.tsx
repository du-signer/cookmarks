import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { CookmarksProvider } from "./state/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <CookmarksProvider>
        <App />
      </CookmarksProvider>
    </HashRouter>
  </StrictMode>
);
