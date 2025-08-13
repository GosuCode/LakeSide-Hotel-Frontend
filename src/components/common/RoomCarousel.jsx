import { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { Card, Button, Typography, Spin, Alert } from "antd";
import { CarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const RoomCarousel = () => {
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllRooms()
      .then((data) => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Spin tip="Loading rooms..." />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <Alert
        type="error"
        message={`Error: ${errorMessage}`}
        style={{ marginTop: 40 }}
      />
    );
  }

  const settings = {
    dots: false,
    infinite: rooms.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section
      style={{
        padding: "24px",
        marginTop: 40,
        marginBottom: 40,
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Browse all rooms
      </Title>

      <Slider {...settings}>
        {rooms.map((room) => (
          <div key={room.id} style={{ padding: "0 8px", margin: "0 20px" }}>
            <Card
              hoverable
              cover={
                <img
                  alt={room.roomType}
                  src={room.photo}
                  style={{ height: 160, objectFit: "cover", padding: "12px" }}
                />
              }
            >
              {/* Hotel Information */}
              {room.hotel && (
                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ fontSize: "12px", color: "#1890ff" }}>
                    🏨 {room.hotel.name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "11px" }}>
                    📍 {room.hotel.address}
                  </Text>
                </div>
              )}

              <Title level={5} ellipsis style={{ marginBottom: 8 }}>
                {room.roomType}
              </Title>
              <Text strong style={{ fontSize: 16 }}>
                Rs. {room.roomPrice} / night
              </Text>
              <div style={{ marginTop: 12 }}>
                <Link to={`/admin/book-room/${room.id}`}>
                  <Button
                    style={{
                      background: "#ee212a",
                      border: "none",
                      color: "#fff",
                    }}
                    icon={<CarOutlined />}
                    block
                  >
                    Book Now
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default RoomCarousel;
