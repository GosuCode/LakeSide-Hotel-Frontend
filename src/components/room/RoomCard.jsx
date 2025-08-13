import PropTypes from "prop-types";
import { Card, Row, Col, Button, Typography, Tag } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const RoomCard = ({ room }) => {
  return (
    <Card style={{ border: "1px solid #ddd", margin: "10px" }}>
      <Row gutter={[16, 16]} align="middle">
        {/* Image */}
        <Col xs={24} sm={8} md={6}>
          <img
            src={room.photo}
            alt={room.roomType}
            style={{
              width: "100%",
              height: 140,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        </Col>

        {/* Room details */}
        <Col xs={24} sm={10} md={12}>
          {/* Hotel Information */}
          {room.hotel && (
            <div
              style={{
                marginBottom: 12,
                padding: "8px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Title level={5} style={{ margin: "0 0 4px", color: "#1890ff" }}>
                🏨 {room.hotel.name}
              </Title>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                📍 {room.hotel.address}
              </Text>
            </div>
          )}

          <Text type="secondary" style={{ textTransform: "capitalize" }}>
            {room.roomCategory} - {room.roomType}
          </Text>
          <Title level={4} style={{ margin: "4px 0" }}>
            Room No: {room.roomNumber}
          </Title>
          <Text>{room.description}</Text>
          <div style={{ marginTop: 8 }}>
            <Tag color="blue">{room.bedType}</Tag>
            {room.amenities && room.amenities.length > 0 ? (
              room.amenities.map((a, i) => (
                <Tag key={i} color="gold" style={{ marginLeft: 4 }}>
                  <CheckOutlined /> {a}
                </Tag>
              ))
            ) : (
              <Text type="secondary" style={{ marginLeft: 4 }}>
                No amenities listed
              </Text>
            )}
          </div>
        </Col>

        {/* Pricing and booking */}
        <Col xs={24} sm={6} md={6} style={{ textAlign: "right" }}>
          <div
            style={{
              background: room.booked ? "#d4380d" : "#389e0d",
              color: "#fff",
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 4,
              fontWeight: "bold",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {room.booked ? "Booked" : "Available"}
          </div>
          <Title level={4} style={{ margin: "0 0 8px" }}>
            Rs. {room.roomPrice}
          </Title>
          <Button
            type="primary"
            disabled={room.booked}
            style={{ background: "#d4a017", border: "none", color: "#fff" }}
          >
            {room.booked ? "Not Available" : "Book Now"}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    roomCategory: PropTypes.string.isRequired,
    roomType: PropTypes.string.isRequired,
    roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    description: PropTypes.string,
    bedType: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
    booked: PropTypes.bool,
    roomPrice: PropTypes.number.isRequired,
    photo: PropTypes.string.isRequired,
    hotel: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      address: PropTypes.string,
      contact: PropTypes.string,
    }),
  }).isRequired,
};

export default RoomCard;
