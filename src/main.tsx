import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import { AppStateProvider } from "@/state/AppState";
import { ToastProvider } from "@/components/ui/Toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppStateProvider>
  </StrictMode>
);
