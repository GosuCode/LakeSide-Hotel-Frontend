import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Tag,
  Spin,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  ArrowLeftOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./HotelRooms.css";
import { BedIcon } from "lucide-react";

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

        {hotel.imageUrl && (
          <div className="hotel-image">
            <img src={hotel.imageUrl} alt={hotel.name} />
          </div>
        )}
      </div>

      {hotel.description && (
        <Card className="description-card">
          <Title level={4}>About {hotel.name}</Title>
          <Paragraph>{hotel.description}</Paragraph>
        </Card>
      )}

      <div className="rooms-section">
        <Title level={2}>
          <BedIcon /> Available Rooms ({rooms.length})
        </Title>

        {rooms.length === 0 ? (
          <Card className="no-rooms-card">
            <Text>No rooms available for this hotel at the moment.</Text>
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {rooms.map((room) => (
              <Col xs={24} sm={12} lg={8} key={room.id}>
                <Card
                  className={`room-card ${
                    room.booked ? "booked" : "available"
                  }`}
                  hoverable
                  actions={[
                    <Button
                      key="view"
                      type="link"
                      onClick={() => handleViewRoomDetails(room.id)}
                    >
                      View Details
                    </Button>,
                    <Button
                      key="book"
                      type="primary"
                      disabled={room.booked}
                      onClick={() => handleBookRoom(room.id)}
                    >
                      {room.booked ? "Booked" : "Book Now"}
                    </Button>,
                  ]}
                >
                  <div className="room-header">
                    <Title level={4}>{room.roomType}</Title>
                    <Tag color={room.booked ? "red" : "green"}>
                      {room.booked ? "Booked" : "Available"}
                    </Tag>
                  </div>

                  <div className="room-details">
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      <Space>
                        <BedIcon />
                        <Text>Room {room.roomNumber}</Text>
                      </Space>

                      <Space>
                        <DollarOutlined />
                        <Text strong>${room.roomPrice}/night</Text>
                      </Space>

                      {room.photo && (
                        <div className="room-photo">
                          <img
                            src={room.photo}
                            alt={`Room ${room.roomNumber}`}
                          />
                        </div>
                      )}
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HotelRooms;
