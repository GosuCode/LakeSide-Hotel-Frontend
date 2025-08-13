import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRoomById } from "../utils/ApiFunctions";
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
  Descriptions,
  message,
} from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  StarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const RoomDetails = () => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams();

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const roomData = await getRoomById(roomId);
      setRoom(roomData);
    } catch (error) {
      message.error("Failed to fetch room details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "20px" }}>Loading room details...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3} type="danger">
          Room not found
        </Title>
        <Link to="/browse-all-rooms">
          <Button type="primary">Back to Rooms</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Link to="/browse-all-rooms">
          <Button icon={<HomeOutlined />} type="link">
            ← Back to Rooms
          </Button>
        </Link>
        <Title level={2} style={{ margin: "16px 0 8px 0" }}>
          {room.roomType} Room
        </Title>
        {room.hotel && (
          <Text type="secondary" style={{ fontSize: "16px" }}>
            🏨 {room.hotel.name} • 📍 {room.hotel.address}
          </Text>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {/* Main Image */}
        <Col xs={24} lg={16}>
          <Card>
            <Image
              src={room.photo}
              alt={`${room.roomType} Room`}
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
            />
          </Card>
        </Col>

        {/* Room Info Card */}
        <Col xs={24} lg={8}>
          <Card>
            <Title level={3} style={{ color: "#1890ff", marginBottom: "16px" }}>
              Room Details
            </Title>

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Price */}
              <div>
                <Text strong style={{ fontSize: "18px" }}>
                  <DollarOutlined style={{ marginRight: "8px" }} />
                  Price per Night
                </Text>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#52c41a",
                    marginTop: "8px",
                  }}
                >
                  Rs. {room.roomPrice}
                </div>
              </div>

              {/* Status */}
              <div>
                <Text strong>
                  <CalendarOutlined style={{ marginRight: "8px" }} />
                  Availability
                </Text>
                <div style={{ marginTop: "8px" }}>
                  <Tag color={room.isBooked ? "red" : "green"} size="large">
                    {room.isBooked ? "Booked" : "Available"}
                  </Tag>
                </div>
              </div>

              {/* Book Now Button */}
              {!room.isBooked && (
                <Link to={`/book-room/${room.id}`}>
                  <Button type="primary" size="large" block>
                    Book This Room
                  </Button>
                </Link>
              )}

              {/* Hotel Info */}
              {room.hotel && (
                <div>
                  <Text strong>
                    <HomeOutlined style={{ marginRight: "8px" }} />
                    Hotel Information
                  </Text>
                  <div style={{ marginTop: "8px" }}>
                    <Text>{room.hotel.name}</Text>
                    <br />
                    <Text type="secondary">{room.hotel.address}</Text>
                    {room.hotel.contact && (
                      <>
                        <br />
                        <Text type="secondary">📞 {room.hotel.contact}</Text>
                      </>
                    )}
                  </div>
                </div>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Room Specifications */}
      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={12}>
          <Card title="Room Specifications">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Room Type">
                <Tag color="blue">{room.roomType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Bed Type">
                <Tag color="purple">{room.bedType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Room Number">
                <Text strong>{room.roomNumber}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                <Tag color="orange">{room.roomCategory}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Amenities">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {room.amenities && room.amenities.length > 0 ? (
                room.amenities.map((amenity, index) => (
                  <Tag key={index} color="green" icon={<StarOutlined />}>
                    {amenity}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">No amenities listed</Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Description */}
      <Card title="Description" style={{ marginTop: "24px" }}>
        <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>
          {room.description || "No description available for this room."}
        </Paragraph>
      </Card>

      {/* Action Buttons */}
      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <Space size="large">
          <Link to="/browse-all-rooms">
            <Button size="large">Browse All Rooms</Button>
          </Link>
          {!room.isBooked && (
            <Link to={`/book-room/${room.id}`}>
              <Button type="primary" size="large">
                Book This Room Now
              </Button>
            </Link>
          )}
        </Space>
      </div>
    </div>
  );
};

export default RoomDetails;
