import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  ApartmentOutlined,
  BuildOutlined,
  ScheduleOutlined,
  TeamOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;
const { Text } = Typography;

export default function Sidebar() {
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{ backgroundColor: "#fff", borderRight: "1px solid #e0e0e0" }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          fontFamily: "cursive",
        }}
      >
        Lakeside Hotel
      </Text>
      <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/admin/hotels" icon={<ApartmentOutlined />}>
          <Link to="/admin/hotels">Hotels</Link>
        </Menu.Item>
        <Menu.Item key="/admin/rooms" icon={<BuildOutlined />}>
          <Link to="/admin/rooms">Rooms</Link>
        </Menu.Item>
        <Menu.Item key="/admin/bookings" icon={<ScheduleOutlined />}>
          <Link to="/admin/bookings">Bookings</Link>
        </Menu.Item>
        <Menu.Item key="/admin/customers" icon={<TeamOutlined />}>
          <Link to="/admin/customers">Customers</Link>
        </Menu.Item>
        <Menu.Item key="/" icon={<GlobalOutlined />}>
          <Link to="/">Home Page</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
