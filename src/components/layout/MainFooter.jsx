import { Layout, Row, Col, Typography, Space } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import logo from "../../assets/LakeSide.png";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const { Footer } = Layout;
const { Title, Text, Link } = Typography;

const MainFooter = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    setIsAdmin(userRole === "ROLE_ADMIN");
  }, [userRole]);

  if (isAdmin && location.pathname.startsWith("/admin")) return null;

  return (
    <Footer
      style={{
        backgroundColor: "#fff",
        padding: "50px 80px",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <Row gutter={[32, 32]} align="top">
        {/* Logo & Hotel Info */}
        <Col xs={24} sm={12} md={8}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <img
              src={logo}
              alt="logo"
              height={80}
              width={80}
              style={{ marginRight: 16 }}
            />
            <Title level={4} style={{ margin: 0 }}>
              LakeSide
            </Title>
          </div>
          <Text style={{ display: "block", color: "#555" }}>
            123 Beach Avenue, Pokhara, Nepal
          </Text>
          <Text style={{ display: "block", color: "#555" }}>
            Email: info@lakesidehotel.com
          </Text>
          <Text style={{ display: "block", color: "#555" }}>
            Phone: +977 9800000000
          </Text>
        </Col>

        {/* Quick Links */}
        <Col xs={24} sm={12} md={8}>
          <Title level={5} style={{ color: "#333" }}>
            Quick Links
          </Title>
          <Space direction="vertical">
            <Link href="/" style={{ color: "#555" }}>
              Home
            </Link>
            <Link href="/rooms" style={{ color: "#555" }}>
              Rooms
            </Link>
            <Link href="/services" style={{ color: "#555" }}>
              Services
            </Link>
            <Link href="/contact" style={{ color: "#555" }}>
              Contact Us
            </Link>
          </Space>
        </Col>

        {/* Social Media */}
        <Col xs={24} sm={24} md={8}>
          <Title level={5} style={{ color: "#333" }}>
            Follow Us
          </Title>
          <Space size="middle">
            <Link href="https://facebook.com" target="_blank">
              <FacebookOutlined style={{ fontSize: 24, color: "#555" }} />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <InstagramOutlined style={{ fontSize: 24, color: "#555" }} />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <TwitterOutlined style={{ fontSize: 24, color: "#555" }} />
            </Link>
          </Space>
        </Col>
      </Row>
    </Footer>
  );
};

export default MainFooter;
