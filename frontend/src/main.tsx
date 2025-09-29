import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/authprovider";
import { ToastContainer, Slide } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer
        limit={1}
        transition={Slide}
        position="top-center"
        autoClose={3000}
        className="bg-color"
     />
        <AuthProvider>
          <App />
        </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
