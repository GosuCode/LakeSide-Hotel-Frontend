import { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Card,
  Space,
  Spin,
  message,
  Tag,
  Row,
  Col,
  Statistic,
  Input,
  Button,
} from "antd";
import {
  TeamOutlined,
  SearchOutlined,
  CalendarOutlined,
  HomeOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import { getAllBookings } from "../../../components/utils/ApiFunctions";
import toast from "react-hot-toast";

const { Title, Text } = Typography;
const { Search } = Input;

const Customers = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
      message.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      (booking.guestName &&
        booking.guestName.toLowerCase().includes(searchLower)) ||
      (booking.guestEmail &&
        booking.guestEmail.toLowerCase().includes(searchLower)) ||
      (booking.room?.roomType &&
        booking.room.roomType.toLowerCase().includes(searchLower)) ||
      (booking.room?.hotel?.name &&
        booking.room.hotel.name.toLowerCase().includes(searchLower)) ||
      (booking.bookingConfirmationCode &&
        booking.bookingConfirmationCode.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    {
      title: "Customer",
      key: "customer",
      width: "20%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <UserOutlined style={{ color: "#1890ff", marginRight: 8 }} />
            <Text strong>{record.guestName || "N/A"}</Text>
          </div>
          <div>
            <MailOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            <Text type="secondary">{record.guestEmail || "N/A"}</Text>
          </div>
          <div>
            <PhoneOutlined style={{ color: "#722ed1", marginRight: 8 }} />
            <Text type="secondary">{record.guestPhone || "N/A"}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Room & Hotel",
      key: "roomHotel",
      width: "20%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <BuildOutlined style={{ color: "#faad14", marginRight: 8 }} />
            <Text strong>
              {record.room?.roomType || "N/A"} -{" "}
              {record.room?.roomNumber || "N/A"}
            </Text>
          </div>
          <div>
            <HomeOutlined style={{ color: "#1890ff", marginRight: 8 }} />
            <Text>{record.room?.hotel?.name || "N/A"}</Text>
          </div>
          <div>
            <Text type="secondary">
              {record.room?.roomCategory || "N/A"} •{" "}
              {record.room?.bedType || "N/A"}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Booking Period",
      key: "dates",
      width: "18%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <CalendarOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            <Text strong>Check-in: {record.checkInDate}</Text>
          </div>
          <div>
            <CalendarOutlined style={{ color: "#faad14", marginRight: 8 }} />
            <Text strong>Check-out: {record.checkOutDate}</Text>
          </div>
          <div>
            <Text type="secondary">{record.numOfNights || "N/A"} night(s)</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Guests",
      key: "guests",
      width: "12%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>Adults: {record.numOfAdults || 0}</Text>
          </div>
          <div>
            <Text>Children: {record.numOfChildren || 0}</Text>
          </div>
          <div>
            <Text type="secondary">Total: {record.totalNumOfGuests || 0}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: "12%",
      render: (_, record) => {
        const today = new Date();
        const checkIn = new Date(record.checkInDate);
        const checkOut = new Date(record.checkOutDate);

        let status = "Upcoming";
        let color = "blue";

        if (today >= checkIn && today <= checkOut) {
          status = "Active";
          color = "green";
        } else if (today > checkOut) {
          status = "Completed";
          color = "default";
        }

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Confirmation",
      key: "confirmation",
      width: "18%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <Text strong>#{record.bookingConfirmationCode}</Text>
          </div>
          <div>
            <Text type="secondary">ID: {record.id}</Text>
          </div>
        </Space>
      ),
    },
  ];

  const stats = {
    totalBookings: bookings.length,
    activeBookings: bookings.filter((booking) => {
      const today = new Date();
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      return today >= checkIn && today <= checkOut;
    }).length,
    upcomingBookings: bookings.filter((booking) => {
      const today = new Date();
      const checkIn = new Date(booking.checkInDate);
      return today < checkIn;
    }).length,
    completedBookings: bookings.filter((booking) => {
      const today = new Date();
      const checkOut = new Date(booking.checkOutDate);
      return today > checkOut;
    }).length,
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading customer bookings..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title={
          <Space>
            <TeamOutlined style={{ color: "#1890ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Customer Bookings
            </Title>
          </Space>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={6}>
            <Statistic
              title="Total Bookings"
              value={stats.totalBookings}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Statistic
              title="Active Bookings"
              value={stats.activeBookings}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Statistic
              title="Upcoming Bookings"
              value={stats.upcomingBookings}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Statistic
              title="Completed Bookings"
              value={stats.completedBookings}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Col>
        </Row>

        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <Search
            placeholder="Search by customer name, email, room type, hotel, or confirmation code..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ flex: 1 }}
          />
          {searchQuery && (
            <Button onClick={() => setSearchQuery("")} size="large">
              Clear Search
            </Button>
          )}
        </div>

        {searchQuery && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              background: "#f6ffed",
              border: "1px solid #b7eb8f",
              borderRadius: "6px",
            }}
          >
            <Text>
              Search results for &ldquo;<Text strong>{searchQuery}</Text>&rdquo;
              - Found {filteredBookings.length} booking
              {filteredBookings.length !== 1 ? "s" : ""}
            </Text>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} bookings`,
          }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: searchQuery ? (
              <div style={{ padding: "24px", textAlign: "center" }}>
                <Text type="secondary">
                  No bookings found matching your search criteria
                </Text>
                <br />
                <Button type="link" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </div>
            ) : (
              "No bookings available"
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default Customers;
