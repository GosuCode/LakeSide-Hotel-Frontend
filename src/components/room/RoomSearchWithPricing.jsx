import { useState } from "react";
import {
  DatePicker,
  Select,
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { getRoomsWithPricing } from "../utils/ApiFunctions";
import PricingDisplay from "../common/PricingDisplay";
import toast from "react-hot-toast";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const RoomSearchWithPricing = () => {
  const [searchParams, setSearchParams] = useState({
    checkIn: null,
    checkOut: null,
    roomType: null,
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const roomTypes = [
    "Single",
    "Double",
    "Twin",
    "Queen",
    "King",
    "Suite",
    "Deluxe",
    "Family",
    "Studio",
  ];

  const handleSearch = async () => {
    if (!searchParams.checkIn || !searchParams.checkOut) {
      toast.warning("Please select both check-in and check-out dates");
      return;
    }

    setLoading(true);
    try {
      const checkIn = searchParams.checkIn.format("YYYY-MM-DD");
      const checkOut = searchParams.checkOut.format("YYYY-MM-DD");

      const roomsData = await getRoomsWithPricing(
        checkIn,
        checkOut,
        searchParams.roomType
      );

      setRooms(roomsData);
      setHasSearched(true);

      if (roomsData.length === 0) {
        toast.info("No rooms available for the selected dates and criteria");
      } else {
        toast.success(`Found ${roomsData.length} room(s) with dynamic pricing`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching for rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    setSearchParams((prev) => ({
      ...prev,
      checkIn: dates?.[0] || null,
      checkOut: dates?.[1] || null,
    }));
  };

  const handleRoomTypeChange = (value) => {
    setSearchParams((prev) => ({
      ...prev,
      roomType: value,
    }));
  };

  const clearSearch = () => {
    setSearchParams({
      checkIn: null,
      checkOut: null,
      roomType: null,
    });
    setRooms([]);
    setHasSearched(false);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Search Header */}
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2}>
            <HomeOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
            Find Your Perfect Room
          </Title>
          <Text type="secondary">
            Search for available rooms with dynamic pricing based on dates and
            demand
          </Text>
        </div>

        {/* Search Form */}
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <div>
              <Text strong>Check-in & Check-out:</Text>
              <RangePicker
                onChange={handleDateChange}
                placeholder={["Check-in", "Check-out"]}
                style={{ width: "100%", marginTop: "8px" }}
                value={[searchParams.checkIn, searchParams.checkOut]}
              />
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong>Room Type:</Text>
              <Select
                placeholder="All Types"
                style={{ width: "100%", marginTop: "8px" }}
                value={searchParams.roomType}
                onChange={handleRoomTypeChange}
                allowClear
              >
                {roomTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>

          <Col xs={24} sm={24} md={10}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={loading}
                size="large"
              >
                Search Rooms
              </Button>
              <Button onClick={clearSearch} size="large">
                Clear
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div>
          <div style={{ marginBottom: "16px" }}>
            <Title level={4}>
              Search Results ({rooms.length} room{rooms.length !== 1 ? "s" : ""}
              )
            </Title>
            {searchParams.checkIn && searchParams.checkOut && (
              <Text type="secondary">
                Showing prices for {searchParams.checkIn.format("MMM DD")} -{" "}
                {searchParams.checkOut.format("MMM DD")}
              </Text>
            )}
          </div>

          {rooms.length > 0 ? (
            <Row gutter={[16, 16]}>
              {rooms.map((room) => (
                <Col xs={24} lg={12} key={room.id}>
                  <Card>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <img
                        src={room.photo || "/placeholder.svg"}
                        alt={room.roomType}
                        style={{
                          width: "120px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: "0 0 8px 0" }}>
                          {room.roomType}
                        </Title>
                        <PricingDisplay pricing={room} showDetails={true} />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card style={{ textAlign: "center", padding: "48px" }}>
              <CalendarOutlined
                style={{
                  fontSize: "48px",
                  color: "#d9d9d9",
                  marginBottom: "16px",
                }}
              />
              <Title level={4} type="secondary">
                No rooms found
              </Title>
              <Text type="secondary">
                Try adjusting your search criteria or dates
              </Text>
            </Card>
          )}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <Card style={{ textAlign: "center", padding: "48px" }}>
          <SearchOutlined
            style={{ fontSize: "48px", color: "#d9d9d9", marginBottom: "16px" }}
          />
          <Title level={4} type="secondary">
            Ready to search?
          </Title>
          <Text type="secondary">
            Select your dates and room preferences to see dynamic pricing
          </Text>
        </Card>
      )}
    </div>
  );
};

export default RoomSearchWithPricing;
