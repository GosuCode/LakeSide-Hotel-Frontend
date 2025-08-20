import { useState } from "react";
import {
  Button,
  Row,
  Col,
  DatePicker,
  Form,
  Typography,
  Card,
  Select,
} from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

const RoomSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState({
    checkInDate: "",
    checkOutDate: "",
    roomType: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = () => {
    if (!searchQuery.checkInDate || !searchQuery.checkOutDate) {
      setErrorMessage("Please select both check-in and check-out dates");
      return;
    }

    const checkInMoment = moment(searchQuery.checkInDate);
    const checkOutMoment = moment(searchQuery.checkOutDate);

    if (!checkOutMoment.isSameOrAfter(checkInMoment)) {
      setErrorMessage("Check-out date must be after check-in date");
      return;
    }

    // Navigate to browse-all-rooms with search parameters
    const searchParams = new URLSearchParams({
      checkInDate: searchQuery.checkInDate.format("YYYY-MM-DD"),
      checkOutDate: searchQuery.checkOutDate.format("YYYY-MM-DD"),
      roomType: searchQuery.roomType || "",
    });

    navigate(`/browse-all-rooms?${searchParams.toString()}`);
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setSearchQuery({
        ...searchQuery,
        checkInDate: dates[0],
        checkOutDate: dates[1],
      });
      setErrorMessage("");
    } else {
      setSearchQuery({
        ...searchQuery,
        checkInDate: "",
        checkOutDate: "",
      });
    }
  };

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

  return (
    <>
      <Card
        className="shadow"
        style={{
          marginBottom: "20px",
          padding: "20px",
          zIndex: 1000,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={3}>Search for Available Rooms</Title>
        </div>

        <Row gutter={[24, 16]} justify="center" align="middle">
          <Col xs={24} sm={12} md={12}>
            <Form layout="vertical">
              <Form.Item label="Select Dates">
                <RangePicker
                  size="large"
                  style={{ width: "100%" }}
                  onChange={handleDateRangeChange}
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  }
                  placeholder={["Check-in Date", "Check-out Date"]}
                />
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form layout="vertical">
              <Form.Item label="Room Type">
                <Select placeholder="Select room type">
                  {roomTypes.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} sm={24} md={6}>
            <Form layout="vertical">
              <Form.Item label=" ">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSearch}
                  style={{ width: "100%", padding: "10px" }}
                >
                  Search Rooms
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>

        {errorMessage && (
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Typography.Text type="danger">{errorMessage}</Typography.Text>
          </div>
        )}
      </Card>
    </>
  );
};

export default RoomSearch;
