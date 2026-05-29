import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Account from "./pages/Account";
import ItemDetailPage from "./pages/ItemDetailPage";
import Register from "./components/Register";
import Login from "./components/Login";  // ← ADD THIS


// FOR FOLDER IMPORTING
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
        <Route path="/account" element={<Account />} />
        <Route path="/report-item" element={<ReportItem />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


        <Route path="/item/:id" element={<ItemDetailPage />} />

        {/* ADMIN */}
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/edit/:id" element={<EditReport />} />
      </Routes>
    </div>
  );
}


export default App;