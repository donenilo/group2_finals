import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
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
        <Route path="/report-item" element={<ReportItem />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="my-account" replace />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="my-reports" element={<MyReports />} />
          <Route path="all-reports" element={<AllReports />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin" element={<Dashboard />}>
          <Route path="manage-accounts" element={<ManageAccounts />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="edit/:id" element={<EditReport />} />
        </Route>

        <Route path="/my-reports" element={<MyReports />} />
      </Routes>
    </div>
  );
}

export default App;