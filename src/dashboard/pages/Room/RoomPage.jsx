import { useState, useEffect, useMemo } from "react";
import {
  getAllRooms,
  getAllHotels,
} from "../../../components/utils/ApiFunctions";
import {
  Button,
  Typography,
  Card,
  Row,
  Col,
  Spin,
  Pagination,
  Input,
  Select,
  Space,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(12);
  const [filters, setFilters] = useState({
    search: "",
    hotelId: "",
    roomType: "",
    status: "",
    roomCategory: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);

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

  const fetchHotels = async () => {
    try {
      const hotelsData = await getAllHotels();
      setHotels(hotelsData);
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
    }
  };

  // Filter rooms based on selected criteria
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Search filter (room number or room type)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          room.roomNumber?.toString().toLowerCase().includes(searchLower) ||
          room.roomType?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Hotel filter
      if (filters.hotelId) {
        const hotelId = parseInt(filters.hotelId);
        if (room.hotel?.id !== hotelId) return false;
      }

      // Room type filter
      if (filters.roomType && room.roomType !== filters.roomType) {
        return false;
      }

      // Status filter
      if (filters.status) {
        if (filters.status === "available" && room.isBooked) return false;
        if (filters.status === "booked" && !room.isBooked) return false;
      }

      // Room category filter
      if (filters.roomCategory && room.roomCategory !== filters.roomCategory) {
        return false;
      }

      return true;
    });
  }, [rooms, filters]);

  const clearFilters = () => {
    setFilters({
      search: "",
      hotelId: "",
      roomType: "",
      status: "",
      roomCategory: "",
    });
  };

  // Get unique room types and categories
  const roomTypes = [...new Set(rooms.map((room) => room.roomType))].filter(
    Boolean
  );
  const roomCategories = [
    ...new Set(rooms.map((room) => room.roomCategory)),
  ].filter(Boolean);

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

      {/* Filters */}
      <Card
        style={{ marginBottom: 24, backgroundColor: "#f5f5f5" }}
        title={
          <Space>
            <FilterOutlined />
            <Text strong>Quick Filters</Text>
          </Space>
        }
        extra={
          <Button size="small" onClick={clearFilters}>
            Clear All
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Search by room number or type"
              allowClear
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="All Hotels"
              style={{ width: "100%" }}
              allowClear
              value={filters.hotelId || undefined}
              onChange={(value) =>
                setFilters({ ...filters, hotelId: value || "" })
              }
            >
              {hotels.map((hotel) => (
                <Select.Option key={hotel.id} value={hotel.id.toString()}>
                  {hotel.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="All Room Types"
              style={{ width: "100%" }}
              allowClear
              value={filters.roomType || undefined}
              onChange={(value) =>
                setFilters({ ...filters, roomType: value || "" })
              }
            >
              {roomTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="All Categories"
              style={{ width: "100%" }}
              allowClear
              value={filters.roomCategory || undefined}
              onChange={(value) =>
                setFilters({ ...filters, roomCategory: value || "" })
              }
            >
              {roomCategories.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="All Status"
              style={{ width: "100%" }}
              allowClear
              value={filters.status || undefined}
              onChange={(value) =>
                setFilters({ ...filters, status: value || "" })
              }
            >
              <Select.Option value="available">Available</Select.Option>
              <Select.Option value="booked">Booked</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col span={24}>
            <Text type="secondary">
              Showing {filteredRooms.length} of {rooms.length} rooms
            </Text>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {filteredRooms
          .slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage)
          .map((room) => (
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
                        <Text strong>Price: </Text>Rs.{room.roomPrice}
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

      {/* Pagination */}
      {filteredRooms.length > 0 && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Pagination
            current={currentPage}
            total={filteredRooms.length}
            pageSize={roomsPerPage}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} rooms`
            }
          />
        </div>
      )}

      {filteredRooms.length === 0 && !loading && (
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
