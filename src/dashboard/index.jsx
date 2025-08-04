import { Layout } from "antd";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import DashboardContent from "./dashboardContent";

const { Content } = Layout;
const AdminDashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Navbar />
        <Content
          style={{ margin: "24px 16px", padding: 24, background: "#fff" }}
        >
          <DashboardContent />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
