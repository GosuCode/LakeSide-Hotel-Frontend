import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Spin,
  Alert,
  Typography,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  getDashboardStats,
  getBookingsByMonth,
  getRoomOccupancy,
  getRecentBookings,
  getTopPerformingHotels,
} from "../components/utils/ApiFunctions";
import { BedIcon } from "lucide-react";

const { Title, Text } = Typography;

export default function DashboardContent() {
  const [stats, setStats] = useState(null);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [roomOccupancy, setRoomOccupancy] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [topHotels, setTopHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, monthlyData, occupancyData, recentData, hotelsData] =
        await Promise.all([
          getDashboardStats(),
          getBookingsByMonth(),
          getRoomOccupancy(),
          getRecentBookings(),
          getTopPerformingHotels(),
        ]);

      setStats(statsData);
      setMonthlyBookings(monthlyData);
      setRoomOccupancy(occupancyData);
      setRecentBookings(recentData);
      setTopHotels(hotelsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const recentBookingsColumns = [
    {
      title: "Guest",
      dataIndex: "guestName",
      key: "guestName",
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.guestEmail}
          </Text>
        </div>
      ),
    },
    {
      title: "Room Type",
      dataIndex: "roomType",
      key: "roomType",
    },
    {
      title: "Check-in",
      dataIndex: "checkIn",
      key: "checkIn",
    },
    {
      title: "Check-out",
      dataIndex: "checkOut",
      key: "checkOut",
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `$${amount || 0}`,
    },
    {
      title: "Confirmation",
      dataIndex: "confirmationCode",
      key: "confirmationCode",
      render: (code) => (
        <Text code style={{ fontSize: "11px" }}>
          {code}
        </Text>
      ),
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "20px" }}>
          <Text>Loading dashboard data...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Dashboard"
        description={error}
        type="error"
        showIcon
        style={{ marginBottom: "24px" }}
      />
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: "32px" }}>
        Dashboard Overview
      </Title>

      {/* Key Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={stats?.totalBookings || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Hotels"
              value={stats?.totalHotels || 0}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Rooms"
              value={stats?.totalRooms || 0}
              prefix={<BedIcon />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats?.totalRevenue || 0}
              prefix="$"
              valueStyle={{ color: "#52c41a", fontSize: "24px" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Recent Bookings (30 days)"
              value={stats?.recentBookings || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Available Rooms"
              value={stats?.availableRooms || 0}
              prefix={<BedIcon />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tables Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Bookings" style={{ marginBottom: "16px" }}>
            <Table
              dataSource={recentBookings}
              columns={recentBookingsColumns}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Performing Hotels" style={{ marginBottom: "16px" }}>
            {topHotels.map((hotel, index) => (
              <div
                key={hotel.hotelId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom:
                    index < topHotels.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {index === 0 && (
                    <TrophyOutlined
                      style={{ color: "#faad14", marginRight: "8px" }}
                    />
                  )}
                  <Text strong>Hotel #{hotel.hotelId}</Text>
                </div>
                <Text>{hotel.bookingCount} bookings</Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Bookings Trend" style={{ height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#1890ff"
                  strokeWidth={2}
                  dot={{ fill: "#1890ff", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Room Type Distribution" style={{ height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomOccupancy}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ roomType, total }) => `${roomType}: ${total}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {roomOccupancy.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Room Occupancy Bar Chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        <Col span={24}>
          <Card title="Room Occupancy by Type" style={{ height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomOccupancy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="roomType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#1890ff" name="Total Rooms" />
                <Bar dataKey="occupied" fill="#ff4d4f" name="Occupied" />
                <Bar dataKey="available" fill="#52c41a" name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
