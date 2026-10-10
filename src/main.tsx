import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRoutes } from "./app/routes";
import "@fontsource-variable/inter";
import "./styles/globals.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Не удалось найти корневой элемент приложения с id "root".');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
);