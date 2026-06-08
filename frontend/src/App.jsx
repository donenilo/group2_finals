import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Items from "./pages/Items";
import ItemDetailPage from "./pages/ItemDetailPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Unauthorized from "./pages/Unauthorized";

import Dashboard from "./pages/Dashboard/Dashboard";
import MyAccount from "./pages/Dashboard/MyAccount";
import ManageAccounts from "./pages/Dashboard/ManageAccounts";
import AllReports from "./pages/Dashboard/AllReports";

import Inventory from "./components/Admin/Inventory";
import EditReport from "./components/Admin/EditReport";
import ReportItem from "./components/User/ReportItem";
import MyReports from "./components/User/MyReports";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<Items />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* REPORT: logged-in users only */}
        <Route
          path="/report-item"
          element={
            <ProtectedRoute>
              <ReportItem />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD: any logged-in user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="my-account" replace />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="my-reports" element={<MyReports />} />

          {/* All Reports: DO and Admin only */}
          <Route
            path="all-reports"
            element={
              <ProtectedRoute allowedRoles={["do", "admin"]}>
                <AllReports />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ADMIN: Admin (IT Staff) only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="manage-accounts" element={<ManageAccounts />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="edit/:id" element={<EditReport />} />
        </Route>

        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <MyReports />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;