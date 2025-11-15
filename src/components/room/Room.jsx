import { useEffect, useState } from "react";
import { getAllRooms, getAllHotels } from "../utils/ApiFunctions";
import RoomCard from "./RoomCard";
import { Col, Container, Row, Card } from "react-bootstrap";
import { Button, Skeleton, Alert } from "antd";
import RoomPaginator from "../common/RoomPaginator";
import RoomFilters from "./RoomFilters";

const Room = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6);
  const [filteredData, setFilteredData] = useState([{ id: "" }]);
  const [hotels, setHotels] = useState([]);
  const [sortBy, setSortBy] = useState("priceHigh");

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    roomType: "",
    roomCategory: "",
    bedType: "",
    amenities: [],
    availability: "all",
    hotelId: "",
  });

  // Available amenities for filtering
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
    "Laundry Service",
  ];

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getAllRooms(), getAllHotels()])
      .then(([roomsData, hotelsData]) => {
        setData(roomsData);
        setFilteredData(roomsData);
        setHotels(hotelsData);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Container>
      <Card
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
          backgroundColor: "#def0fa",
        }}
      >
        <Row justify="center" align="middle" style={{ alignItems: "center" }}>
          <Col>
            <Skeleton.Input active size="small" style={{ width: 100 }} />
          </Col>
          <Col>
            <Skeleton.Button active size="small" />
          </Col>
          <Col>
            <Skeleton.Button active size="small" />
          </Col>
          <Col>
            <Skeleton.Button active size="small" />
          </Col>
        </Row>
      </Card>
      <Row>
        {/* Filter Sidebar Skeleton */}
        <Col md={3} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <Skeleton.Input active size="small" style={{ width: 120 }} />
            </Card.Header>
            <Card.Body>
              <Skeleton active paragraph={{ rows: 8 }} />
            </Card.Body>
          </Card>
        </Col>

        {/* Room Cards Skeleton - Horizontal Layout */}
        <Col md={9}>
          <Row>
            {[...Array(5)].map((_, index) => (
              <Col md={12} key={index} className="mb-4">
                <Card>
                  <Row>
                    {/* Left: Image */}
                    <Col md={4}>
                      <Skeleton.Image
                        active
                        style={{ width: 300, height: 250 }}
                      />
                    </Col>
                    {/* Middle: Hotel and Room Details */}
                    <Col md={5} className="p-3">
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 200, marginBottom: 10 }}
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 150, marginBottom: 15 }}
                      />
                      <Skeleton active paragraph={{ rows: 2 }} />
                      <div style={{ marginTop: 10 }}>
                        <Skeleton.Button
                          active
                          size="small"
                          style={{ marginRight: 5, marginBottom: 5 }}
                        />
                        <Skeleton.Button
                          active
                          size="small"
                          style={{ marginRight: 5, marginBottom: 5 }}
                        />
                        <Skeleton.Button
                          active
                          size="small"
                          style={{ marginRight: 5, marginBottom: 5 }}
                        />
                      </div>
                    </Col>
                    {/* Right: Price and Actions */}
                    <Col md={3} className="p-3">
                      <Skeleton.Button
                        active
                        size="small"
                        style={{ width: "100%", marginBottom: 15 }}
                      />
                      <Skeleton.Input
                        active
                        size="large"
                        style={{ width: "100%", marginBottom: 10 }}
                      />
                      <Skeleton.Button
                        active
                        size="default"
                        style={{ width: "100%", marginBottom: 10 }}
                      />
                      <Skeleton.Button
                        active
                        size="default"
                        style={{ width: "100%" }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Container style={{ marginTop: 40 }}>
        <Alert
          message="Error Loading Rooms"
          description={error}
          type="error"
          showIcon
          closable
        />
      </Container>
    );
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredData.length / roomsPerPage);

  const applyFilters = () => {
    let filtered = data;

    // Price filter
    filtered = filtered.filter(
      (room) =>
        room.roomPrice >= filters.priceRange[0] &&
        room.roomPrice <= filters.priceRange[1]
    );

    // Room type filter
    if (filters.roomType) {
      filtered = filtered.filter((room) => room.roomType === filters.roomType);
    }

    // Room category filter
    if (filters.roomCategory) {
      filtered = filtered.filter(
        (room) => room.roomCategory === filters.roomCategory
      );
    }

    // Bed type filter
    if (filters.bedType) {
      filtered = filtered.filter((room) => room.bedType === filters.bedType);
    }

    // Hotel filter
    if (filters.hotelId) {
      filtered = filtered.filter(
        (room) => room.hotel?.id === parseInt(filters.hotelId)
      );
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((room) =>
        filters.amenities.every((amenity) => room.amenities?.includes(amenity))
      );
    }

    // Availability filter
    if (filters.availability === "available") {
      filtered = filtered.filter(
        (room) => !room.hasCurrentBookings || room.isAvailableForDates
      );
    } else if (filters.availability === "booked") {
      filtered = filtered.filter((room) => room.hasCurrentBookings);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      roomType: "",
      roomCategory: "",
      bedType: "",
      amenities: [],
      availability: "all",
      hotelId: "",
    });
    setFilteredData(data);
    setCurrentPage(1);
  };

  const renderRooms = () => {
    let sortedData = [...filteredData];

    // Sort by price (highest to lowest by default)
    if (sortBy === "priceHigh") {
      sortedData.sort((a, b) => (b.roomPrice || 0) - (a.roomPrice || 0));
    } else if (sortBy === "priceLow") {
      sortedData.sort((a, b) => (a.roomPrice || 0) - (b.roomPrice || 0));
    } else if (sortBy === "rating") {
      sortedData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const startIndex = (currentPage - 1) * roomsPerPage;
    const endIndex = startIndex + roomsPerPage;
    return sortedData
      .slice(startIndex, endIndex)
      .map((room) => <RoomCard key={room.id} room={room} />);
  };

  return (
    <Container>
      <Card
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
          backgroundColor: "#def0fa",
        }}
      >
        <Row justify="center" align="middle" style={{ alignItems: "center" }}>
          <Col>
            <b style={{ fontSize: "16px" }}>SORT BY:</b>
          </Col>
          <Col>
            <Button
              type="text"
              onClick={() => setSortBy("rating")}
              style={{
                color: sortBy === "rating" ? "#1890ff" : "#666",
                fontWeight: sortBy === "rating" ? "600" : "400",
              }}
            >
              User Ratings
            </Button>
          </Col>
          <Col>
            <Button
              type="text"
              onClick={() => setSortBy("priceHigh")}
              style={{
                color: sortBy === "priceHigh" ? "#1890ff" : "#666",
                fontWeight: sortBy === "priceHigh" ? "600" : "400",
              }}
            >
              <b>Price</b>(Highest First)
            </Button>
          </Col>
          <Col>
            <Button
              type="text"
              onClick={() => setSortBy("priceLow")}
              style={{
                color: sortBy === "priceLow" ? "#1890ff" : "#666",
                fontWeight: sortBy === "priceLow" ? "600" : "400",
              }}
            >
              <b>Price</b>(Lowest First)
            </Button>
          </Col>
        </Row>
      </Card>
      <Row>
        {/* Filter Sidebar */}
        <RoomFilters
          filters={filters}
          setFilters={setFilters}
          availableAmenities={availableAmenities}
          hotels={hotels}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />

        {/* Room Listing */}
        <Col md={9}>
          <Row>{renderRooms()}</Row>
          <Row>
            <Col className="d-flex align-items-center justify-content-end">
              <RoomPaginator
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Room;
