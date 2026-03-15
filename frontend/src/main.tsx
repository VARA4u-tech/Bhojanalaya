import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global error handlers for debugging
window.onerror = (message, source, lineno, colno, error) => {
  console.group("Global Error Caught:");
  console.error("Message:", message);
  console.error("Source:", source);
  console.error("Line:", lineno, "Column:", colno);
  console.error("Error object:", error);
  console.groupEnd();
};

window.onunhandledrejection = (event) => {
  console.group("Unhandled Promise Rejection:");
  console.error("Reason:", event.reason);
  console.groupEnd();
};

import { SocketProvider } from "@/context/SocketContext";

createRoot(document.getElementById("root")!).render(
  <SocketProvider>
    <App />
  </SocketProvider>,
);
