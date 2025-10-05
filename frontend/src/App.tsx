import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import SignIn from "./pages/Signin";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layouts/OuterLayout";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import LoaderComponent from "./components/Loader";
import LoaderPage from "./components/LoaderComponent";
import AppLayout from "./layout";
import Recipients from "./pages/Recipients";
import WalletPage from "./pages/Wallet";
import TopupsPage from "./pages/Topups";

const App = () => {
  return (
    <div className="bg-color min-h-svh">
      <Routes>
        .{/* Authentication management  */}
        {/* <Route element={<PublicRoute />}> */}
          <Route element={<AuthLayout />}>
            <Route index path="/log-in" element={<SignIn />} />

            <Route path="/sign-up" element={<Signup />} />
            <Route path="/loader" element={<LoaderPage />} />
          </Route>
        {/* </Route> */}
        <Route element={<AppLayout />}>
          {/* <Route element={<ProtectedRoute />}> */}
            {/* Dashboard (Analytics and reports) */}
            <Route
              index
              path="/"
              element={<h1 className="text-white">Dashboard</h1>}
            ></Route>
            {/* Recipient managemant */}
            <Route
              path="/recipients"
              element={<Recipients/>}
            ></Route>
            {/* Airtime distribution */}
            <Route
              path="/top-ups"
              element={<TopupsPage/>}
            ></Route>
            {/* Wallet management */}
            <Route
              path="/wallet"
              element={<WalletPage/>}
            ></Route>
            {/*Reporting and analytics dashboard  */}
            <Route
              path="/transactions"
              element={<h1 className="text-white">Transactions</h1>}
            ></Route>
            {/*  User management  */}
            <Route path="/users"></Route>\{/* 404 page */}
          {/* </Route> */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
