import { Col, Form, Card } from "react-bootstrap";
import { Button } from "antd";
import { Slider, Checkbox } from "antd";
import PropTypes from "prop-types";

const RoomFilters = ({
  filters,
  setFilters,
  availableAmenities,
  hotels,
  applyFilters,
  clearFilters,
}) => {
  return (
    <Col md={3} className="mb-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Filter Rooms</h5>
        </Card.Header>
        <Card.Body>
          {/* Price Range */}
          <div className="mb-3">
            <label className="form-label">
              Price Range: Rs. {filters.priceRange[0]} - Rs.
              {filters.priceRange[1]}
            </label>
            <Slider
              range
              min={0}
              max={1000}
              value={filters.priceRange}
              onChange={(value) =>
                setFilters({ ...filters, priceRange: value })
              }
              tooltip={{ formatter: (value) => `Rs. ${value}` }}
            />
          </div>

          {/* Room Type */}
          <div className="mb-3">
            <label className="form-label">Room Type</label>
            <Form.Select
              value={filters.roomType}
              onChange={(e) =>
                setFilters({ ...filters, roomType: e.target.value })
              }
            >
              <option value="">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Presidential">Presidential</option>
            </Form.Select>
          </div>

          {/* Room Category */}
          <div className="mb-3">
            <label className="form-label">Room Category</label>
            <Form.Select
              value={filters.roomCategory}
              onChange={(e) =>
                setFilters({ ...filters, roomCategory: e.target.value })
              }
            >
              <option value="">All Categories</option>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="Luxury">Luxury</option>
              <option value="Premium">Premium</option>
            </Form.Select>
          </div>

          {/* Bed Type */}
          <div className="mb-3">
            <label className="form-label">Bed Type</label>
            <Form.Select
              value={filters.bedType}
              onChange={(e) =>
                setFilters({ ...filters, bedType: e.target.value })
              }
            >
              <option value="">All Bed Types</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Queen">Queen</option>
              <option value="King">King</option>
              <option value="Twin">Twin</option>
              <option value="Twin XL">Twin XL</option>
            </Form.Select>
          </div>

          {/* Amenities */}
          <div className="mb-3">
            <label className="form-label">Amenities</label>
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              <Checkbox.Group
                value={filters.amenities}
                onChange={(checkedValues) =>
                  setFilters({ ...filters, amenities: checkedValues })
                }
              >
                {availableAmenities.map((amenity) => (
                  <div key={amenity} style={{ marginBottom: "8px" }}>
                    <Checkbox value={amenity}>{amenity}</Checkbox>
                  </div>
                ))}
              </Checkbox.Group>
            </div>
          </div>

          {/* Hotel Filter */}
          <div className="mb-3">
            <label className="form-label">Hotel</label>
            <Form.Select
              value={filters.hotelId}
              onChange={(e) =>
                setFilters({ ...filters, hotelId: e.target.value })
              }
            >
              <option value="">All Hotels</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </Form.Select>
          </div>

          {/* Availability */}
          <div className="mb-3">
            <label className="form-label">Availability</label>
            <Form.Select
              value={filters.availability}
              onChange={(e) =>
                setFilters({ ...filters, availability: e.target.value })
              }
            >
              <option value="all">All Rooms</option>
              <option value="available">Available Only</option>
              <option value="booked">Booked Only</option>
            </Form.Select>
          </div>

          {/* Action Buttons */}
          <div className="d-grid gap-2">
            <Button variant="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button variant="outline-secondary" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RoomFilters;

RoomFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  availableAmenities: PropTypes.array.isRequired,
  hotels: PropTypes.array.isRequired,
  applyFilters: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
};
