import { Layout, Typography, Avatar, Dropdown, Menu, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const { Header } = Layout;
const { Title, Text } = Typography;

export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Admin";
    const email = localStorage.getItem("userId") || "admin@lakeside.com";
    setUserName(name);
    setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Text>Profile</Text>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Text>Settings</Text>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        <Text>Logout</Text>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px #f0f1f2",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
          Welcome Admin!
        </Title>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Notifications */}
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{ fontSize: "16px" }}
        />

        {/* User Profile */}
        <Dropdown
          overlay={userMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "background-color 0.3s",
              ":hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <Avatar
              size="default"
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff", marginRight: "8px" }}
            />
            <Text strong style={{ fontSize: "14px", lineHeight: "1" }}>
              {userName}
            </Text>
            (
            <Text
              type="secondary"
              style={{ fontSize: "12px", lineHeight: "1" }}
            >
              {userEmail}
            </Text>
            )
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
