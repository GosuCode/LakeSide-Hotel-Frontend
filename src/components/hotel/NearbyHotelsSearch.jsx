import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spin,
  Alert,
  Tag,
  Space,
  Typography,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./NearbyHotelsSearch.css";

const { Title, Text } = Typography;

const NearbyHotelsSearch = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError("");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          findNearbyHotels(latitude, longitude);
        },
        () => {
          setLoading(false);
          setError(
            "Location access denied. Please enable location services to find nearby hotels."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      setLoading(false);
      setError("Geolocation is not supported by this browser.");
    }
  };

  const findNearbyHotels = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `http://localhost:9192/api/v1/hotels/nearby?lat=${latitude}&lon=${longitude}&k=10`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();

      if (!responseText.trim()) {
        throw new Error("Empty response from server");
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Invalid JSON response from server");
      }

      setHotels(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setHotels([]);
      setLoading(false);
    }
  };

  const retryLocation = () => {
    getCurrentLocation();
  };

  if (loading) {
    return (
      <div className="nearby-hotels-container">
        <div className="loading-container">
          <Spin size="large" />
          <Title level={2} style={{ marginTop: 16 }}>
            Finding nearby hotels...
          </Title>
          <Text type="secondary">Please allow location access to continue</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nearby-hotels-container">
        <Alert
          message="Location Access Required"
          description={error}
          type="warning"
          showIcon
          action={
            <Button size="small" type="primary" onClick={retryLocation}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="nearby-hotels-container">
      <div className="header-section">
        <Title level={2}>Nearby Hotels</Title>
        <Text type="secondary">Showing hotels near your current location</Text>
      </div>

      {hotels.length > 0 ? (
        <div className="results-container">
          <div className="results-header">
            <Title level={3}>Found {hotels.length} hotels nearby</Title>
          </div>

          <Row gutter={[24, 24]}>
            {hotels.map((hotel, index) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={hotel.id}>
                <Card
                  hoverable
                  className={`hotel-card ${index === 0 ? "nearest" : ""}`}
                  onClick={() =>
                    (window.location.href = `/hotel/${hotel.id}/rooms`)
                  }
                  cover={
                    <div className="hotel-image-container">
                      <img
                        alt={hotel.name}
                        src={hotel.imageUrl}
                        className="hotel-image"
                      />
                      {index === 0 && (
                        <Tag color="gold" className="nearest-badge">
                          <EnvironmentOutlined /> Nearest
                        </Tag>
                      )}
                    </div>
                  }
                >
                  <div className="hotel-content">
                    <Title level={4} className="hotel-name">
                      {hotel.name}
                    </Title>

                    <div className="hotel-info">
                      <Space
                        direction="vertical"
                        size="small"
                        style={{ width: "100%" }}
                      >
                        <div className="info-item">
                          <EnvironmentOutlined className="info-icon" />
                          <Text>
                            {hotel.address || "Address not available"}
                          </Text>
                        </div>

                        <div className="info-item">
                          <HomeOutlined className="info-icon" />
                          <Text>
                            {hotel.roomsCount
                              ? `${hotel.roomsCount} Rooms Available`
                              : "Rooms info not available"}
                          </Text>
                        </div>

                        <div className="info-item">
                          <PhoneOutlined className="info-icon" />
                          <Text>
                            {hotel.contact || "Contact not available"}
                          </Text>
                        </div>

                        <div className="info-item">
                          <MailOutlined className="info-icon" />
                          <Text>{hotel.email || "Email not available"}</Text>
                        </div>

                        <div className="distance-info">
                          <Tag color="blue">
                            <EnvironmentOutlined /> {hotel.distance.toFixed(2)}{" "}
                            km away
                          </Tag>
                        </div>
                      </Space>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div className="no-results">
          <Alert
            message="No hotels found nearby"
            description="Try refreshing the page or check your location settings."
            type="info"
            showIcon
          />
        </div>
      )}
    </div>
  );
};

export default NearbyHotelsSearch;
