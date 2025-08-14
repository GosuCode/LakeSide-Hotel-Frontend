import { useState, useEffect } from "react";
import { cancelBooking, getAllBookings } from "../utils/ApiFunctions";
import BookingsTable from "./BookingsTable";
import { Typography, Alert, Spin, Card } from "antd";

const { Title } = Typography;

const Bookings = () => {
  const [bookingInfo, setBookingInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookingInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Simulated delay for loading effect
    setTimeout(fetchBookings, 1000);
  }, []);

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      const data = await getAllBookings();
      setBookingInfo(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section style={{ backgroundColor: "#f5f5f5", padding: "24px" }}>
      <Title level={2}>Existing Bookings</Title>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" tip="Loading existing bookings..." />
        </div>
      ) : (
        <Card>
          <BookingsTable
            bookingInfo={bookingInfo}
            handleBookingCancellation={handleBookingCancellation}
          />
        </Card>
      )}
    </section>
  );
};

export default Bookings;
