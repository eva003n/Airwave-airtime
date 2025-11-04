import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/authprovider";
import { ToastContainer, Slide } from "react-toastify";
import { TopupProvider } from "./context/topup.provider";
import EnvProvider from "./context/Environment/Env.provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer
        limit={1}
        transition={Slide}
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-2xl shadow-lg font-medium "
      />
      <AuthProvider>
        <EnvProvider>
          <TopupProvider>
            <App />
          </TopupProvider>
        </EnvProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
