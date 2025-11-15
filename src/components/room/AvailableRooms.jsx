import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Tag,
  Typography,
  Select,
  Slider,
  Checkbox,
  Pagination,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { BedIcon } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";

const { Title, Text } = Typography;

const AvailableRooms = ({ rooms, handleBookRoom, handleViewRoomDetails }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    roomType: "",
    bedType: "",
    amenities: [],
    maxGuests: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Available filter options
  const roomTypes = [...new Set(rooms.map((room) => room.roomType))];
  const bedTypes = [...new Set(rooms.map((room) => room.bedType))];
  const availableAmenities = [
    "Wi-Fi",
    "Air Conditioning",
    "TV",
    "Mini Bar",
    "Room Service",
    "Balcony",
    "Coffee Maker",
    "Safe",
    "Hair Dryer",
    "Iron",
    "Bathtub",
    "Desk",
    "Refrigerator",
    "Telephone",
    "Heating",
  ];

  // Filter rooms based on selected criteria
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Price filter
      if (
        room.roomPrice < filters.priceRange[0] ||
        room.roomPrice > filters.priceRange[1]
      ) {
        return false;
      }

      // Room type filter
      if (filters.roomType && room.roomType !== filters.roomType) {
        return false;
      }

      // Bed type filter
      if (filters.bedType && room.bedType !== filters.bedType) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        if (
          !room.amenities ||
          !filters.amenities.every((amenity) =>
            room.amenities.includes(amenity)
          )
        ) {
          return false;
        }
      }

      // Max guests filter
      if (filters.maxGuests && room.maxAdults < parseInt(filters.maxGuests)) {
        return false;
      }

      return true;
    });
  }, [rooms, filters]);

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      roomType: "",
      bedType: "",
      amenities: [],
      maxGuests: "",
    });
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  return (
    <div className="rooms-section">
      <Title level={2}>
        <BedIcon /> Available Rooms ({filteredRooms.length})
      </Title>

      <Row gutter={[24, 24]}>
        {/* Filter Sidebar */}
        <Col xs={24} sm={24} md={6}>
          <Card
            title={
              <Space>
                <FilterOutlined />
                Filter Rooms
              </Space>
            }
            className="filter-sidebar"
          >
            {/* Price Range */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>
                Price Range: Rs. {filters.priceRange[0]} - Rs.{" "}
                {filters.priceRange[1]}
              </Text>
              <Slider
                range
                min={0}
                max={1000}
                value={filters.priceRange}
                onChange={(value) =>
                  setFilters({ ...filters, priceRange: value })
                }
                tooltip={{ formatter: (value) => `Rs. ${value}` }}
                style={{ marginTop: 8 }}
              />
            </div>

            {/* Room Type */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>Room Type</Text>
              <Select
                placeholder="All Types"
                value={filters.roomType}
                onChange={(value) =>
                  setFilters({ ...filters, roomType: value })
                }
                style={{ width: "100%", marginTop: 8 }}
                allowClear
              >
                {roomTypes.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* Bed Type */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>Bed Type</Text>
              <Select
                placeholder="All Bed Types"
                value={filters.bedType}
                onChange={(value) => setFilters({ ...filters, bedType: value })}
                style={{ width: "100%", marginTop: 8 }}
                allowClear
              >
                {bedTypes.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>Amenities</Text>
              <Checkbox.Group
                value={filters.amenities}
                onChange={(checkedValues) =>
                  setFilters({ ...filters, amenities: checkedValues })
                }
                style={{ marginTop: 8 }}
              >
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                  {availableAmenities.map((amenity) => (
                    <div key={amenity} style={{ marginBottom: 8 }}>
                      <Checkbox value={amenity}>{amenity}</Checkbox>
                    </div>
                  ))}
                </div>
              </Checkbox.Group>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="primary"
                block
                onClick={() => {}} // Filters apply automatically
              >
                Apply Filters
              </Button>
              <Button block onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </Card>
        </Col>

        {/* Rooms Display */}
        <Col xs={24} sm={24} md={18}>
          {filteredRooms.length === 0 ? (
            <Card className="no-rooms-card">
              <Text>
                No rooms match your current filters. Try adjusting your
                criteria.
              </Text>
            </Card>
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {filteredRooms
                  .slice(
                    (currentPage - 1) * roomsPerPage,
                    currentPage * roomsPerPage
                  )
                  .map((room) => (
                    <Col xs={24} sm={12} lg={8} key={room.id}>
                      <Card
                        className="room-card border-1 border-dark-subtle"
                        hoverable
                        actions={[
                          <Button
                            key="view"
                            type="link"
                            onClick={() => handleViewRoomDetails(room.id)}
                          >
                            View Details
                          </Button>,
                          <Button
                            key="book"
                            type="primary"
                            onClick={() => handleBookRoom(room.id)}
                          >
                            Book Now
                          </Button>,
                        ]}
                      >
                        <div className="room-header">
                          <Title level={4}>{room.roomType}</Title>
                          <Tag color="green">Available</Tag>
                        </div>

                        <div className="room-details">
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
                            <Space>
                              <BedIcon />
                              <Text>Room No. {room.roomNumber}</Text>
                            </Space>

                            <Space>
                              <Text strong>Rs. {room.roomPrice} / night</Text>
                            </Space>

                            {room.photo && (
                              <div className="room-photo">
                                <img
                                  src={room.photo}
                                  alt={`Room ${room.roomNumber}`}
                                />
                              </div>
                            )}
                          </Space>
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>

              {/* Pagination */}
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
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AvailableRooms;

AvailableRooms.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      roomType: PropTypes.string.isRequired,
      roomNumber: PropTypes.string.isRequired,
      roomPrice: PropTypes.number.isRequired,
      photo: PropTypes.string,
    })
  ).isRequired,
  handleBookRoom: PropTypes.func.isRequired,
  handleViewRoomDetails: PropTypes.func.isRequired,
};
