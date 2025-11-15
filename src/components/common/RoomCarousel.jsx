import { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { Card, Button, Typography, Spin, Alert } from "antd";
import { CarOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const RoomCarousel = ({ title }) => {
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

  const getRoomsFromDifferentHotels = () => {
    const hotelMap = new Map();
    const uniqueRooms = [];
    const allRooms = [];

    for (const room of rooms) {
      const hotelId = room.hotel?.id || room.hotelId || null;

      if (hotelId && !hotelMap.has(hotelId)) {
        hotelMap.set(hotelId, true);
        uniqueRooms.push(room);
      }

      if (hotelId) {
        allRooms.push(room);
      }
    }

    if (uniqueRooms.length < 10) {
      for (const room of allRooms) {
        if (uniqueRooms.length >= 10) break;
        if (!uniqueRooms.some((r) => r.id === room.id)) {
          uniqueRooms.push(room);
        }
      }
    }

    return uniqueRooms.slice(0, 10);
  };

  const displayRooms = getRoomsFromDifferentHotels();

  const settings = {
    dots: false,
    infinite: displayRooms.length > 4,
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
        {title || "Browse all rooms"}
      </Title>

      <Slider {...settings}>
        {displayRooms.map((room) => (
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
                <Link to={`/room/${room.id}`}>
                  <Button
                    style={{
                      background: "#1890ff",
                      border: "none",
                      color: "#fff",
                      marginBottom: "8px",
                    }}
                    block
                  >
                    View Details
                  </Button>
                </Link>
                <Link to={`/book-room/${room.id}`}>
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

RoomCarousel.propTypes = {
  title: PropTypes.string,
};
