import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import DashboardContent from "./dashboardContent";
import RoomPage from "./pages/Room/RoomPage";
import Hotels from "./pages/Hotel/Hotels";
import HotelForm from "./pages/Hotel/HotelForm";
import RoomForm from "./pages/Room/RoomForm";
import Bookings from "../components/booking/Bookings";
import Customers from "./pages/Customers/Customers";

const { Content } = Layout;
const AdminDashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh", margin: "0" }}>
      <Sidebar />
      <Layout>
        <Navbar />
        <Content
          style={{
            margin: "16px",
            padding: 24,
            background: "#fff",
          }}
        >
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/new" element={<HotelForm />} />
            <Route path="/hotels/edit/:hotelId" element={<HotelForm />} />
            <Route path="/rooms" element={<RoomPage />} />
            <Route path="/add-room" element={<RoomForm />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/edit-room/:roomId" element={<RoomForm />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
