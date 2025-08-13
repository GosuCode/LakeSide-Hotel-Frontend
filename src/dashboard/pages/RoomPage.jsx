import { useState, useEffect } from "react";
import { getAllRooms } from "../../components/utils/ApiFunctions";
import { Button, Typography, Card, Row, Col, Spin } from "antd";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const { Title, Paragraph, Text } = Typography;

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await getAllRooms();
      setRooms(roomsData);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "20px" }}>Loading rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3} type="danger">
          Error loading rooms
        </Title>
        <Paragraph>{error}</Paragraph>
        <Button type="primary" onClick={fetchRooms}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Room Management</Title>
          <Paragraph>Manage all rooms in the hotel system</Paragraph>
        </Col>
        <Col>
          <Button type="primary" size="large">
            <Link to="/admin/add-room">Add New Room</Link>
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {rooms.map((room) => (
          <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
            <Card
              hoverable
              cover={
                room.photo ? (
                  <img
                    alt={`Room ${room.roomNumber}`}
                    src={room.photo}
                    style={{ height: 200, objectFit: "cover" }}
                    className="bg-dark-subtle"
                  />
                ) : (
                  <div
                    style={{
                      height: 200,
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text type="secondary" className="">
                      No Image
                    </Text>
                  </div>
                )
              }
              actions={[
                <Link key="edit" to={`/admin/edit-room/${room.id}`}>
                  Edit
                </Link>,
                <Link key="details" to={`/admin/existing-rooms`}>
                  View Details
                </Link>,
              ]}
            >
              <Card.Meta
                title={
                  <div
                    style={{
                      marginBottom: 12,
                      padding: "8px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <Title
                      level={5}
                      style={{ margin: "0 0 4px", color: "#1890ff" }}
                    >
                      🏨 {room.hotel.name}
                    </Title>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      📍 {room.hotel.address}
                    </Text>
                  </div>
                }
                description={
                  <div>
                    <Paragraph>
                      {`Room ${room.roomNumber} - ${room.roomType}`}
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 8 }}>
                      <Text strong>Price: </Text>${room.roomPrice}
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 8 }}>
                      <Text strong>Status: </Text>
                      <Text type={room.isBooked ? "danger" : "success"}>
                        {room.isBooked ? "Booked" : "Available"}
                      </Text>
                    </Paragraph>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {rooms.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Title level={3}>No rooms found</Title>
          <Paragraph>There are no rooms in the system yet.</Paragraph>
          <Button type="primary">
            <Link to="/admin/add-room">Add First Room</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
