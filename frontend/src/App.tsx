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
import MakeTopUpPage from "./pages/Topups/Maketopup.tsx";
import CreateRecipientPage from "./pages/Recipients/Createrecipient.tsx";
import EditRecipientPage from "./pages/Recipients/Editrecipient.tsx";
import RecipientManagementPage from "./pages/Recipients/Recipients.tsx";
import RecipientLayout from "./layouts/RecipientLayout.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import BulkTopUpQueue from "./pages/Jobs/Topupjobs.tsx";
import TopupLayout from "./layouts/TopupLayout.tsx";
import TopUpsPage from "./pages/Topups/Topups.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import DashboardPage from "./pages/Admin/Dashboard/Dashboard.tsx";
import UserManagementPage from "./pages/Admin/Users/Users.tsx";
import CreateUserPage from "./pages/Admin/Users/Createuser.tsx";
import EditUserPage from "./pages/Admin/Users/Edituser.tsx";

const App = () => {
  return (
    <div className="bg-color min-h-svh ">
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
            {/* ------- Admin routes ------- */}

            <Route element={<PrivateRoute />}>
              {/* Dashboard (Analytics and reports) */}
              <Route
                index
                path="/admin/dashboard"
                element={<DashboardPage />}
              ></Route>
              {/*  User management  */}
              <Route path="/admin/users">
                <Route index element={<UserManagementPage />} />
                <Route path="user" element={<CreateUserPage />} />
                <Route path="user/:id" element={<EditUserPage />} />

              </Route>
              <Route path="/admin/users" element={<UserManagementPage />} />
              {/*  Transactions management  */}
              <Route
                path="/admin/transactions"
                element={<h1>Transactions</h1>}
              />
              {/*  Ledger management  */}
              <Route path="/admin/ledger" element={<h1>Ledger</h1>} />
              {/*  Settings management  */}
              <Route path="/admin/settings" element={<h1>Settings</h1>} />
            </Route>

            {/* ------- Users routes ------- */}
            {/* Dashboard (Analytics and reports) */}
            <Route index path="/dashboard" element={<Dashboard />}></Route>
            {/* Recipient managemant */}
            <Route path="/recipients" element={<RecipientLayout />}>
              <Route index element={<RecipientManagementPage />} />
              <Route path="recipient" element={<CreateRecipientPage />} />
              <Route path=":recipient" element={<EditRecipientPage />} />
            </Route>
            {/* Airtime distribution */}
            <Route path="/top-ups">
              <Route index element={<TopUpsPage />} />
              <Route element={<TopupLayout />}>
                <Route path="make-topup" element={<MakeTopUpPage />} />
              </Route>
              <Route path="bulk" element={<BulkTopUpQueue />} />
            </Route>
            {/* Wallet management */}
            <Route path="/wallet" element={<WalletPage />}></Route>
            {/*Reporting and analytics dashboard  */}
            <Route
              path="/transactions"
              element={<h1 className="text-white">Transactions</h1>}
            ></Route>
          </Route>
        </Route>
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
