import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoomById } from "../utils/ApiFunctions";
import BookingForm from "../booking/BookingForm";
import RoomCarousel from "../common/RoomCarousel";

import {
  Descriptions,
  Spin,
  Alert,
  Row,
  Col,
  Typography,
  Image,
  Space,
  Tag,
} from "antd";

import {
  FaUtensils,
  FaWifi,
  FaTv,
  FaWineGlassAlt,
  FaParking,
  FaCar,
  FaTshirt,
} from "react-icons/fa";

const { Title } = Typography;

const amenityIconMap = {
  wifi: <FaWifi />,
  netflix: <FaTv />,
  breakfast: <FaUtensils />,
  minibar: <FaWineGlassAlt />,
  car: <FaCar />,
  parking: <FaParking />,
  laundry: <FaTshirt />,
};

const defaultAmenities = ["Wifi", "Breakfast", "Parking Space", "Laundry"];

const Checkout = () => {
  const { roomId } = useParams();

  const [roomInfo, setRoomInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getRoomById(roomId)
      .then((data) => {
        setRoomInfo(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load room info");
        setIsLoading(false);
      });
  }, [roomId]);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Spin size="large" tip="Loading room information..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Error"
        description={error}
        style={{ marginTop: 40 }}
      />
    );
  }

  const {
    photo,
    roomType,
    roomPrice,
    roomNumber,
    roomCategory,
    bedType,
    description,
    amenities,
    hotel,
  } = roomInfo || {};

  const amenitiesToShow =
    amenities && amenities.length > 0 ? amenities : defaultAmenities;

  return (
    <div
      style={{
        padding: "24px 48px",
        marginTop: 40,
      }}
    >
      <Row gutter={[32, 32]}>
        {/* Room Image and Details */}
        <Col xs={24} md={10}>
          <Image
            src={photo}
            alt={`${roomCategory} - ${roomType}`}
            style={{ borderRadius: 8 }}
            preview={false}
            width="100%"
            height={250}
            placeholder
          />
          <Descriptions
            title={<Title level={4}>{hotel?.name || "Hotel"}</Title>}
            bordered
            column={1}
            style={{ marginTop: 24 }}
          >
            <Descriptions.Item label="Room Category">
              {roomCategory}
            </Descriptions.Item>
            <Descriptions.Item label="Room Type">{roomType}</Descriptions.Item>
            <Descriptions.Item label="Room Number">
              {roomNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Bed Type">{bedType}</Descriptions.Item>
            <Descriptions.Item label="Price per Night">
              Rs. {roomPrice}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {description}
            </Descriptions.Item>
            <Descriptions.Item label="Amenities">
              <Space wrap>
                {amenitiesToShow.map((a) => {
                  const key = a.toLowerCase().replace(/\s/g, "");
                  return (
                    <Tag
                      key={a}
                      color="gold"
                      icon={
                        <span style={{ marginRight: 6 }}>
                          {amenityIconMap[key] || null}
                        </span>
                      }
                    >
                      {a}
                    </Tag>
                  );
                })}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Col>

        {/* Booking Form */}
        <Col xs={24} md={14}>
          <BookingForm roomId={roomId} />
        </Col>
      </Row>

      {/* Related rooms carousel */}
      <div style={{ marginTop: 48 }}>
        <RoomCarousel />
      </div>
    </div>
  );
};

export default Checkout;
