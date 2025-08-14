import { useState, useEffect } from "react";
import "./NearbyHotelsSearch.css";

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
      // Use full backend URL to avoid proxy issues
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
          <div className="loading-spinner"></div>
          <h2>Finding nearby hotels...</h2>
          <p>Please allow location access to continue</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nearby-hotels-container">
        <div className="error-container">
          <h2>Location Access Required</h2>
          <p className="error-message">{error}</p>
          <button onClick={retryLocation} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nearby-hotels-container">
      <h2>Nearby Hotels</h2>
      <p className="location-info">Showing hotels near your current location</p>

      {hotels.length > 0 ? (
        <div className="results-container">
          <h3>Found {hotels.length} hotels nearby</h3>
          <div className="hotels-list">
            {hotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className={`hotel-card ${index === 0 ? "nearest" : ""}`}
              >
                <div className="hotel-header">
                  <h4>{hotel.name}</h4>
                  {index === 0 && (
                    <span className="nearest-badge">Nearest</span>
                  )}
                </div>
                <div className="hotel-details">
                  <p>
                    <strong>Distance:</strong> {hotel.distance.toFixed(2)} km
                  </p>
                  <p>
                    <strong>Coordinates:</strong> {hotel.latitude.toFixed(6)},{" "}
                    {hotel.longitude.toFixed(6)}
                  </p>
                  <div className="hotel-actions">
                    <button
                      className="btn-view-rooms"
                      onClick={() =>
                        (window.location.href = `/hotel/${hotel.id}/rooms`)
                      }
                    >
                      View Rooms
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-results">
          <h3>No hotels found nearby</h3>
          <p>Try refreshing the page or check your location settings.</p>
        </div>
      )}
    </div>
  );
};

export default NearbyHotelsSearch;
