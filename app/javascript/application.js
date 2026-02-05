import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  document.addEventListener("DOMContentLoaded", () => {
    const c = document.getElementById("root");
    if (c) {
      const root = createRoot(c);
      root.render(<App />);
    }
  });
}
