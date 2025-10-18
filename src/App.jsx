import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Edit from "./pages/Edit";
import User from "./pages/User";
import Notfound from "./pages/Notfound";
import Users from "./pages/Users";

// Hotel Management System Components
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import HotelList from "./components/Hotels/HotelList";
import BlockList from "./components/Blocks/BlockList";
import RoomList from "./components/Rooms/RoomList";
import QRManagement from "./pages/QRManagement";
import RoomDetails from "./pages/RoomDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Original Routes */}
        <Route path="/old/*" element={<><Navbar /><Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Dashboard />} />
          <Route path="profile/edit" element={<Edit />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:username" element={<User />} />
        </Routes></>} />

        {/* Hotel Management System Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="hotels" element={<HotelList />} />
          <Route path="hotels/:hotelId/blocks" element={<BlockList />} />
          <Route path="hotels/:hotelId/blocks/:blockId/rooms" element={<RoomList />} />
          <Route path="blocks" element={<HotelList />} />
          <Route path="rooms" element={<HotelList />} />
          <Route path="qr-management" element={<QRManagement />} />
        </Route>

        {/* Public Room Details Page (for QR codes) */}
        <Route path="/room/:hotelId/:blockId/:roomNo" element={<RoomDetails />} />

        {/* 404 Page */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
}

export default App;
