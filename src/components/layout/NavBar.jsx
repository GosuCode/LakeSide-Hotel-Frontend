import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Layout, Menu, Dropdown, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Logout from "../auth/Logout";

const { Header } = Layout;

const NavBar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  const isLoggedIn = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    setIsAdmin(userRole === "ROLE_ADMIN");
  }, [userRole]);

  if (isAdmin && location.pathname.startsWith("/admin")) return null;

  const accountMenu = (
    <Menu>
      {isAdmin && (
        <Menu.Item key="admin" icon={<SettingOutlined />}>
          <Link to="/admin">Admin Panel</Link>
        </Menu.Item>
      )}
      {isLoggedIn ? (
        <Menu.Item key="logout" icon={<LogoutOutlined />}>
          <Logout />
        </Menu.Item>
      ) : (
        <Menu.Item key="login" icon={<LoginOutlined />}>
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        width: "100%",
        backgroundColor: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Link to="/" className="logo">
          lakeSide Hotel
        </Link>

        <Menu mode="horizontal" selectable={false}>
          <Menu.Item key="browse" icon={<AppstoreOutlined />}>
            <NavLink to="/browse-all-rooms">Browse All Rooms</NavLink>
          </Menu.Item>
          <Menu.Item key="booking" icon={<HomeOutlined />}>
            <NavLink to="/find-booking">Find My Booking</NavLink>
          </Menu.Item>
          <Menu.Item key="account" icon={<UserOutlined />}>
            <Dropdown overlay={accountMenu} trigger={["click"]}>
              <Button type="text" icon={<UserOutlined />}>
                Account
              </Button>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </div>
    </Header>
  );
};

export default NavBar;
