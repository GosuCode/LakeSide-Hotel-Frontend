import { useLocation, useNavigate } from "react-router-dom";
import { Result, Button, Typography } from "antd";
const { Paragraph, Title } = Typography;

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;
  const error = location.state?.error;
  const bookingDetails = location.state?.bookingDetails;

  return (
    <div className="container">
      <Title level={2}>Booking Status</Title>
      <div className="mt-5">
        {message ? (
          <Result
            status="success"
            title="Booking Successful!"
            subTitle={message}
            extra={[
              <Button
                type="primary"
                key="myBookings"
                onClick={() => navigate("/my-bookings")}
              >
                View My Bookings
              </Button>,
              <Button
                key="bookAgain"
                onClick={() => navigate("/browse-all-rooms")}
              >
                Book Another Room
              </Button>,
            ]}
          >
            {bookingDetails && (
              <Paragraph>
                <strong>Room:</strong> {bookingDetails.roomType} <br />
                <strong>Check-in:</strong> {bookingDetails.checkInDate} <br />
                <strong>Check-out:</strong> {bookingDetails.checkOutDate}
              </Paragraph>
            )}
          </Result>
        ) : (
          <Result
            status="error"
            title="Booking Failed"
            subTitle={error || "An unexpected error occurred."}
            extra={[
              <Button
                type="primary"
                key="tryAgain"
                onClick={() => navigate("/rooms")}
              >
                Try Again
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;
