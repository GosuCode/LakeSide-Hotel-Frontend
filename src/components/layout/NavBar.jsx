import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Layout, Dropdown, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Logout from "../auth/Logout";
import logo from "../../assets/LakeSide.png";

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

  const accountMenuItems = [
    ...(isAdmin
      ? [
          {
            key: "admin",
            icon: <SettingOutlined />,
            label: <Link to="/admin">Admin Panel</Link>,
          },
        ]
      : []),
    ...(isLoggedIn
      ? [
          {
            key: "profile",
            icon: <UserOutlined />,
            label: <Link to="/profile">Profile</Link>,
          },
          {
            key: "logout",
            icon: <LogoutOutlined />,
            label: <Logout />,
          },
        ]
      : [
          {
            key: "login",
            icon: <LoginOutlined />,
            label: <Link to="/login">Login</Link>,
          },
        ]),
  ];

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        width: "100%",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          height: "100%",
        }}
      >
        <Link to="/" className="logo">
          <img src={logo} alt="lakeside" style={{ width: "60px" }} />
        </Link>
        <div style={{ display: "flex", alignItems: "center" }}>
          <NavLink
            to="/browse-all-rooms"
            style={{ marginRight: "20px", color: "#000" }}
          >
            Browse Rooms
          </NavLink>
          <NavLink
            to="/nearby-hotels"
            style={{ marginRight: "20px", color: "#000" }}
          >
            Nearby Hotels
          </NavLink>
          <NavLink
            to="/my-bookings"
            style={{ marginRight: "20px", color: "#000" }}
          >
            My Bookings
          </NavLink>

          <Dropdown menu={{ items: accountMenuItems }} trigger={["click"]}>
            <Button type="text" icon={<UserOutlined />}>
              Account
            </Button>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default NavBar;
