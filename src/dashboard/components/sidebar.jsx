import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

export default function Sidebar() {
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div
        className="logo"
        style={{
          height: 32,
          margin: 16,
          background: "rgba(255, 255, 255, 0.3)",
        }}
      />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="2" icon={<BookOutlined />}>
          Bookings
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          Customers
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />}>
          Settings
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
