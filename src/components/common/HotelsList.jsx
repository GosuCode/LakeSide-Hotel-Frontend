import { useState, useEffect } from "react";
import { getAllHotels } from "../utils/ApiFunctions";
import { Card, Row, Col, Typography, Button, Spin, message, Image } from "antd";
import {
  HomeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const HotelsList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const hotelsData = await getAllHotels();
      setHotels(hotelsData);
    } catch (error) {
      message.error("Failed to fetch hotels");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "20px" }}>Loading hotels...</div>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={4} type="secondary">
          No hotels available
        </Title>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <Title level={2}>Our Hotels</Title>
        <Text type="secondary">
          Discover our collection of exceptional hotels
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {hotels.map((hotel) => (
          <Col xs={24} sm={12} lg={8} key={hotel.id}>
            <Card
              hoverable
              cover={
                <Image
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  style={{ height: "250px", objectFit: "cover" }}
                />
              }
              actions={[
                <Link to={`/hotel/${hotel.id}`} key="view">
                  <Button type="primary" icon={<HomeOutlined />}>
                    View Details
                  </Button>
                </Link>,
                <Link to={`/hotel/${hotel.id}/rooms`} key="rooms">
                  <Button>View Rooms</Button>
                </Link>,
              ]}
            >
              <Card.Meta
                title={
                  <Link to={`/hotel/${hotel.id}`} style={{ color: "#1890ff" }}>
                    <Title level={4} style={{ margin: 0, cursor: "pointer" }}>
                      {hotel.name}
                    </Title>
                  </Link>
                }
                description={
                  <div>
                    <div style={{ marginBottom: "8px" }}>
                      <EnvironmentOutlined style={{ marginRight: "8px" }} />
                      <Text type="secondary">{hotel.address}</Text>
                    </div>
                    {hotel.contact && (
                      <div style={{ marginBottom: "8px" }}>
                        <PhoneOutlined style={{ marginRight: "8px" }} />
                        <Text type="secondary">{hotel.contact}</Text>
                      </div>
                    )}
                    <div style={{ marginTop: "12px" }}>
                      <Text strong>Total Rooms: </Text>
                      <Text type="secondary">{hotel.roomsCount || 0}</Text>
                    </div>
                    {hotel.description && (
                      <div style={{ marginTop: "8px" }}>
                        <Text type="secondary">
                          {hotel.description.length > 100
                            ? `${hotel.description.substring(0, 100)}...`
                            : hotel.description}
                        </Text>
                      </div>
                    )}
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HotelsList;
