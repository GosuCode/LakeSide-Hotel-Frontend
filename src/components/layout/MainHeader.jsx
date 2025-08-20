import { Typography, Row, Col } from "antd";
import RoomSearch from "../common/RoomSearch";

const { Title, Paragraph } = Typography;

const MainHeader = () => {
  return (
    <header className="main-hero-section">
      <div className="hero-overlay" />

      <Row justify="center" align="middle" className="hero-content">
        <Col xs={22} sm={20} md={16} lg={12} style={{ textAlign: "center" }}>
          <Title level={1} style={{ color: "#fff", fontSize: "3rem" }}>
            Welcome to <span className="hotel-brand-color">lakeSide Hotel</span>
          </Title>
          <Paragraph style={{ color: "#eee", fontSize: "1.2rem" }}>
            Experience the Best Hospitality in Town
          </Paragraph>
          <RoomSearch />
        </Col>
      </Row>
    </header>
  );
};

export default MainHeader;
