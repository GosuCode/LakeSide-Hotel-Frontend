import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getHotelById } from "../utils/ApiFunctions";
import {
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Button,
  Space,
  Spin,
  Image,
  message,
} from "antd";
import {
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const HotelDetails = () => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const hotelData = await getHotelById(id);
      setHotel(hotelData);
    } catch (error) {
      message.error("Failed to fetch hotel details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "20px" }}>Loading hotel details...</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3} type="danger">
          Hotel not found
        </Title>
        <Link to="/">
          <Button type="primary">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link to="/">
          <Button icon={<HomeOutlined />} type="link">
            ← Back to Home
          </Button>
        </Link>
        <Title level={2} style={{ margin: "16px 0 8px 0" }}>
          {hotel.name}
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          📍 {hotel.address}
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Image
              src={
                hotel.imageUrl ||
                "https://via.placeholder.com/800x400?text=No+Image+Available"
              }
              alt={hotel.name}
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card>
            <Title level={3} style={{ color: "#1890ff", marginBottom: "16px" }}>
              Hotel Information
            </Title>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Text strong>
                  <PhoneOutlined style={{ marginRight: "8px" }} />
                  Contact
                </Text>
                <div style={{ marginTop: "8px" }}>
                  <Text>{hotel.contact || "Not provided"}</Text>
                </div>
              </div>

              {hotel.email && (
                <div>
                  <Text strong>
                    <MailOutlined style={{ marginRight: "8px" }} />
                    Email
                  </Text>
                  <div style={{ marginTop: "8px" }}>
                    <Text>{hotel.email}</Text>
                  </div>
                </div>
              )}

              {hotel.website && (
                <div>
                  <Text strong>
                    <GlobalOutlined style={{ marginRight: "8px" }} />
                    Website
                  </Text>
                  <div style={{ marginTop: "8px" }}>
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text style={{ color: "#1890ff" }}>Visit Website</Text>
                    </a>
                  </div>
                </div>
              )}

              <div>
                <Text strong>Total Rooms</Text>
                <div style={{ marginTop: "8px" }}>
                  <Tag color="blue" size="large">
                    {hotel.roomsCount || 0} Rooms
                  </Tag>
                </div>
              </div>

              <Link to="/browse-all-rooms">
                <Button type="primary" size="large" block>
                  View All Rooms
                </Button>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>

      {hotel.description && (
        <Card title="About This Hotel" style={{ marginTop: "24px" }}>
          <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>
            {hotel.description}
          </Paragraph>
        </Card>
      )}

      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <Space size="large">
          <Link to="/">
            <Button size="large">Back to Home</Button>
          </Link>
          <Link to="/browse-all-rooms">
            <Button type="primary" size="large">
              Browse All Rooms
            </Button>
          </Link>
        </Space>
      </div>
    </div>
  );
};

export default HotelDetails;
