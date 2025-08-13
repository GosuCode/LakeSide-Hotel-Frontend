import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import DashboardContent from "./dashboardContent";
import RoomPage from "./pages/RoomPage";
import RoomForm from "../components/room/RoomForm";
import ExistingRooms from "../components/room/ExistingRooms";
import Hotels from "./pages/Hotels";
import AddHotel from "./pages/AddHotel";
import EditHotel from "./pages/EditHotel";

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
            <Route path="/hotels/add" element={<AddHotel />} />
            <Route path="/hotels/edit/:hotelId" element={<EditHotel />} />
            <Route path="/rooms" element={<RoomPage />} />
            <Route path="/add-room" element={<RoomForm />} />
            <Route path="/existing-rooms" element={<ExistingRooms />} />
            <Route path="/edit-room/:roomId" element={<RoomForm />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
