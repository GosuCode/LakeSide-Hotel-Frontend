import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import DashboardContent from "./dashboardContent";
import RoomPage from "./pages/RoomPage";
import AddRoom from "../components/room/AddRoom";
import ExistingRooms from "../components/room/ExistingRooms";
import EditRoom from "../components/room/EditRoom";
import Checkout from "../components/booking/Checkout";

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
            <Route path="/rooms" element={<RoomPage />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/existing-rooms" element={<ExistingRooms />} />
            <Route path="/edit-room/:roomId" element={<EditRoom />} />
            <Route path="/book-room/:roomId" element={<Checkout />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
