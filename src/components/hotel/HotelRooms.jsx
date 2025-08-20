import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Space, Typography, Spin, message } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "./HotelRooms.css";
import AvailableRooms from "../room/AvailableRooms";

const { Title, Text, Paragraph } = Typography;

const HotelRooms = () => {
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { hotelId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotelAndRooms();
  }, [hotelId]);

  const fetchHotelAndRooms = async () => {
    try {
      setLoading(true);

      const hotelResponse = await fetch(
        `http://localhost:9192/api/v1/hotels/${hotelId}`
      );
      if (!hotelResponse.ok) {
        throw new Error("Hotel not found");
      }
      const hotelData = await hotelResponse.json();

      setHotel(hotelData);

      if (hotelData.rooms && Array.isArray(hotelData.rooms)) {
        setRooms(hotelData.rooms);
      } else {
        setRooms([]);
      }
    } catch (err) {
      setError(err.message);
      message.error("Failed to load hotel information");
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (roomId) => {
    navigate(`/book-room/${roomId}`);
  };

  const handleViewRoomDetails = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  if (loading) {
    return (
      <div className="hotel-rooms-container">
        <div className="loading-container">
          <Spin size="large" />
          <Title level={3}>Loading hotel information...</Title>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="hotel-rooms-container">
        <div className="error-container">
          <Title level={2} type="danger">
            Hotel Not Found
          </Title>
          <Text>{error || "The requested hotel could not be found."}</Text>
          <br />
          <Button
            type="primary"
            onClick={() => navigate("/")}
            style={{ marginTop: 16 }}
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="hotel-rooms-container">
      <Card>
        <div className="hotel-header">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="back-button"
          >
            Back
          </Button>

          <div className="hotel-info">
            <Title level={1} style={{ color: "#000" }}>
              {hotel.name}
            </Title>
            <Space size="large" wrap>
              <Space>
                <EnvironmentOutlined />
                <Text>{hotel.address}</Text>
              </Space>
              {hotel.contact && (
                <Space>
                  <PhoneOutlined />
                  <Text>{hotel.contact}</Text>
                </Space>
              )}
              {hotel.email && (
                <Space>
                  <MailOutlined />
                  <Text>{hotel.email}</Text>
                </Space>
              )}
              {hotel.website && (
                <Space>
                  <GlobalOutlined />
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                </Space>
              )}
            </Space>
          </div>
        </div>
        {hotel.imageUrl && (
          <div style={{ width: "100%", height: "300px" }}>
            <img src={hotel.imageUrl} alt={hotel.name} />
          </div>
        )}
        {hotel.description && (
          <Card className="description-card">
            <Title level={4}>About {hotel.name}</Title>
            <Paragraph>{hotel.description}</Paragraph>
          </Card>
        )}
      </Card>

      <AvailableRooms
        rooms={rooms}
        handleBookRoom={handleBookRoom}
        handleViewRoomDetails={handleViewRoomDetails}
      />
    </div>
  );
};

export default HotelRooms;
