import { Route, Routes } from "react-router-dom";
import "./App.tsx";
import Signup from "./pages/Signup";
import SignIn from "./pages/Signin";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layouts/OuterLayout";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import LoaderComponent from "./components/Loader";
import LoaderPage from "./components/LoaderComponent";
import AppLayout from "./layout";
import WalletPage from "./pages/Wallet";
import TopupsPage from "./pages/Topups";
import MakeTopUpPage from "./pages/Topups/Maketopup.tsx";
import CreateRecipientPage from "./pages/Recipients/Createrecipient.tsx";
import EditRecipientPage from "./pages/Recipients/Editrecipient.tsx";
import RecipientManagementPage from "./pages/Recipients/Recipients.tsx";
import RecipientLayout from "./layouts/RecipientLayout.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import BulkTopUpQueue from "./pages/Topups/Topupqueue.tsx";

const App = () => {
  return (
    <div className="bg-color min-h-svh">
      <Routes>
        .{/* Authentication management  */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<SignIn />} />
            <Route path="/sign-up" element={<Signup />} />
            {/* <Route path="/loader" element={<LoaderPage />} /> */}
          </Route>
        </Route>
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute />}>
            {/* Dashboard (Analytics and reports) */}
            <Route
              index
              path="/dashboard"
              element={<Dashboard/>}
            ></Route>
            {/* Recipient managemant */}
            <Route path="/recipients" element={<RecipientLayout />}>
              <Route index element={<RecipientManagementPage />} />
              <Route path="recipient" element={<CreateRecipientPage />} />
              <Route path=":recipient" element={<EditRecipientPage />} />
            </Route>
            {/* Airtime distribution */}
            <Route path="/top-ups">
              <Route index element={<BulkTopUpQueue/>} />
              <Route path="make-topup" element={<MakeTopUpPage />} />
            </Route>
            {/* Wallet management */}
            <Route path="/wallet" element={<WalletPage />}></Route>
            {/*Reporting and analytics dashboard  */}
            <Route
              path="/transactions"
              element={<h1 className="text-white">Transactions</h1>}
            ></Route>
            {/*  User management  */}
            <Route path="/users"></Route>\
          </Route>
        </Route>
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
