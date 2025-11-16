import { useState, useEffect } from "react";
import moment from "moment";
import { cancelBooking, getBookingsByUserId } from "../utils/ApiFunctions";
import {
  Typography,
  Card,
  Alert,
  Spin,
  Button,
  Row,
  Col,
  Popconfirm,
  Empty,
  Space,
  Tag,
  Divider,
  Avatar,
  Statistic,
  Badge,
  Tooltip,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  MailOutlined,
  CheckCircleTwoTone,
  HomeOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const YourBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const data = await getBookingsByUserId(userId);
      // Sort by check-in date, latest first
      const sortedBookings = data.sort(
        (a, b) => new Date(b.checkInDate) - new Date(a.checkInDate)
      );
      setBookings(sortedBookings);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setSuccessMessage("Booking has been cancelled successfully!");
      // Refresh the bookings list
      fetchUserBookings();
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const calculateNights = (checkIn, checkOut) => {
    return moment(checkOut).diff(moment(checkIn), "days");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Title level={1}>My Bookings</Title>
          <Text style={{ fontSize: "18px" }}>
            Manage your hotel reservations
          </Text>
        </div>

        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            showIcon
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            closable
          />
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{
              marginBottom: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            closable
          />
        )}

        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              background: "rgba(255,255,255,0.95)",
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
            }}
          >
            <Spin size="large" tip="Loading your bookings..." />
          </div>
        ) : bookings.length > 0 ? (
          <Row gutter={[24, 24]}>
            {bookings.map((booking, index) => {
              const nights = calculateNights(
                booking.checkInDate,
                booking.checkOutDate
              );

              return (
                <Col xs={24} lg={12} xl={12} key={index}>
                  <Badge.Ribbon color="purple">
                    <Card
                      style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(10px)",
                        border: "none",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      }}
                      className="booking-card"
                      hoverable
                    >
                      <div style={{ marginBottom: "20px" }}>
                        <Row align="middle" justify="space-between">
                          <Col>
                            <Space align="center">
                              <Avatar
                                size={48}
                                style={{
                                  fontSize: "20px",
                                }}
                                icon={<HomeOutlined />}
                              />
                              <div>
                                <Title
                                  level={4}
                                  style={{ margin: 0, color: "#1a1a1a" }}
                                >
                                  {booking.room.roomType}
                                </Title>
                                <Text type="secondary">
                                  Room {booking.room.roomNumber} (ID #
                                  {booking.room.id})
                                </Text>
                              </div>
                            </Space>
                          </Col>
                          <Col>
                            <Tag
                              color={getStatusColor(booking.status)}
                              style={{
                                borderRadius: "20px",
                                padding: "4px 12px",
                                fontSize: "12px",
                                fontWeight: "500",
                              }}
                            >
                              <CheckCircleTwoTone twoToneColor="#52c41a" />{" "}
                              CONFIRMED
                            </Tag>
                          </Col>
                        </Row>
                      </div>

                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #f6f9fc 0%, #e9f4ff 100%)",
                          borderRadius: "12px",
                          padding: "16px",
                          marginBottom: "20px",
                        }}
                      >
                        <Text
                          strong
                          style={{ color: "#1890ff", fontSize: "14px" }}
                        >
                          Confirmation Code: {booking.bookingConfirmationCode}
                        </Text>
                      </div>

                      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                        <Col span={12}>
                          <div style={{ textAlign: "center", padding: "12px" }}>
                            <CalendarOutlined
                              style={{
                                fontSize: "24px",
                                color: "#52c41a",
                                marginBottom: "8px",
                              }}
                            />
                            <div>
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px", display: "block" }}
                              >
                                Check-in
                              </Text>
                              <Text strong style={{ fontSize: "14px" }}>
                                {moment(booking.checkInDate).format("MMM DD")}
                              </Text>
                            </div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ textAlign: "center", padding: "12px" }}>
                            <CalendarOutlined
                              style={{
                                fontSize: "24px",
                                color: "#ff4d4f",
                                marginBottom: "8px",
                              }}
                            />
                            <div>
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px", display: "block" }}
                              >
                                Check-out
                              </Text>
                              <Text strong style={{ fontSize: "14px" }}>
                                {moment(booking.checkOutDate).format("MMM DD")}
                              </Text>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Divider style={{ margin: "16px 0" }} />

                      <Row gutter={[16, 8]} style={{ marginBottom: "20px" }}>
                        <Col span={24}>
                          <Space size="middle" wrap>
                            <Tooltip title="Guest Name">
                              <Space size="small">
                                <UserOutlined style={{ color: "#1890ff" }} />
                                <Text>{booking.guestName}</Text>
                              </Space>
                            </Tooltip>
                            <Tooltip title="Email">
                              <Space size="small">
                                <MailOutlined style={{ color: "#52c41a" }} />
                                <Text ellipsis style={{ maxWidth: "120px" }}>
                                  {booking.guestEmail}
                                </Text>
                              </Space>
                            </Tooltip>
                          </Space>
                        </Col>
                        <Col span={24}>
                          <Space size="middle" wrap>
                            <Space size="small">
                              <TeamOutlined style={{ color: "#fa8c16" }} />
                              <Text>{booking.numOfAdults} Adults</Text>
                            </Space>
                            <Space size="small">
                              <UserOutlined style={{ color: "#eb2f96" }} />
                              <Text>{booking.numOfChildren} Children</Text>
                            </Space>
                            <Tag color="blue">
                              {booking.totalNumOfGuests} Total Guests
                            </Tag>
                          </Space>
                        </Col>
                      </Row>

                      <div
                        style={{
                          background: "rgba(24, 144, 255, 0.05)",
                          borderRadius: "8px",
                          padding: "12px",
                          marginBottom: "20px",
                        }}
                      >
                        <Row gutter={16}>
                          <Col span={8}>
                            <Statistic
                              title="Nights"
                              value={nights}
                              prefix={<ClockCircleOutlined />}
                              valueStyle={{
                                fontSize: "16px",
                                color: "#1890ff",
                              }}
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic
                              title="Per Night"
                              value={booking.room.roomPrice.toFixed(0)}
                              prefix="Rs."
                              valueStyle={{
                                fontSize: "16px",
                                color: "#52c41a",
                              }}
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic
                              title="Total"
                              value={(booking.room.roomPrice * nights).toFixed(
                                0
                              )}
                              prefix="Rs."
                              valueStyle={{
                                fontSize: "16px",
                                color: "#fa8c16",
                                fontWeight: "bold",
                              }}
                            />
                          </Col>
                        </Row>
                      </div>

                      <Row justify="space-between" align="middle">
                        <Col>
                          <Space>
                            <Tooltip title="Free WiFi">
                              <WifiOutlined
                                style={{ fontSize: "16px", color: "#52c41a" }}
                              />
                            </Tooltip>
                            <Tooltip title="Parking Available">
                              <CarOutlined
                                style={{ fontSize: "16px", color: "#1890ff" }}
                              />
                            </Tooltip>
                            <Tooltip title="Breakfast Included">
                              <CoffeeOutlined
                                style={{ fontSize: "16px", color: "#fa8c16" }}
                              />
                            </Tooltip>
                          </Space>
                        </Col>
                        <Col>
                          <Popconfirm
                            title="Cancel this booking?"
                            description="This action cannot be undone."
                            okText="Yes, cancel"
                            cancelText="Keep booking"
                            okButtonProps={{ danger: true }}
                            onConfirm={() =>
                              handleBookingCancellation(booking.id)
                            }
                          >
                            <Button
                              danger
                              type="text"
                              icon={<DeleteOutlined />}
                              style={{
                                borderRadius: "8px",
                                fontWeight: "500",
                              }}
                            >
                              Cancel
                            </Button>
                          </Popconfirm>
                        </Col>
                      </Row>
                    </Card>
                  </Badge.Ribbon>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 40px",
              background: "rgba(255,255,255,0.95)",
              borderRadius: "20px",
              backdropFilter: "blur(10px)",
            }}
          >
            <Empty
              description={
                <span style={{ fontSize: "16px", color: "#8c8c8c" }}>
                  You haven&apos;t made any bookings yet.
                  <br />
                  <Text type="secondary">
                    Start planning your next adventure!
                  </Text>
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                size="large"
                style={{
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  padding: "8px 24px",
                  height: "auto",
                }}
                onClick={() => navigate("/browse-all-rooms")}
              >
                Browse Hotels
              </Button>
            </Empty>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourBookings;
