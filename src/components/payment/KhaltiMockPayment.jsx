import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Typography, Input, Button, Radio, Space, Alert } from "antd";
import { FaWallet, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";
import { bookRoom } from "../utils/ApiFunctions";

const { Title, Text } = Typography;

const KhaltiMockPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;
  const roomId = location.state?.roomId;
  const amount = location.state?.amount;

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");

  if (!booking || !roomId || !amount) {
    return (
      <div style={{ maxWidth: 480, margin: "60px auto" }}>
        <Alert
          type="error"
          message="Invalid payment session"
          description="We couldn't find any booking information. Please start the booking process again."
          showIcon
        />
        <Button
          style={{ marginTop: 16 }}
          type="primary"
          onClick={() => navigate("/browse-all-rooms")}
        >
          Browse Rooms
        </Button>
      </div>
    );
  }

  const handlePay = async () => {
    setError("");

    if (!/^[9][0-9]{9}$/.test(phoneNumber)) {
      setError("Enter a valid 10-digit Nepali mobile number starting with 9.");
      return;
    }
    if (!/^[0-9]{4}$/.test(pin)) {
      setError("Enter a valid 4 digit Khalti PIN.");
      return;
    }

    setIsPaying(true);

    try {
      // Simulate Khalti processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create booking on backend (dummy payment is always successful here)
      const bookingPayload = {
        ...booking,
        paymentStatus: "PAID",
        paymentProvider: "KHALTI_MOCK",
        amountPaid: amount,
      };

      const result = await bookRoom(roomId, bookingPayload);

      toast.success("Payment successful with Khalti mock!");

      navigate("/booking-success", {
        state: {
          message: "Your payment has been received and booking is confirmed.",
          bookingDetails: {
            roomType: result.room?.roomType || "",
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
          },
        },
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Payment failed. Please try again.");
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "radial-gradient(circle at top, #7C3AED 0, #4C1D95 40%, #020617 100%)",
        padding: "32px 16px",
      }}
    >
      <Card
        style={{
          maxWidth: 480,
          width: "100%",
          borderRadius: 16,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(148, 163, 184, 0.3)",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,64,175,0.98))",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <Title
              level={4}
              style={{ margin: 0, color: "#E5E7EB", letterSpacing: 0.2 }}
            >
              Pay with Khalti
            </Title>
            <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
              Secure payment gateway
            </Text>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #7C3AED, #EC4899, #F59E0B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            k
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 12,
            background:
              "linear-gradient(145deg, rgba(15,23,42,0.85), rgba(17,24,39,0.98))",
            border: "1px solid rgba(55,65,81,0.8)",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#9CA3AF", fontSize: 12 }}>Amount</Text>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: 4,
            }}
          >
            <Title
              level={3}
              style={{
                margin: 0,
                color: "#F9FAFB",
                letterSpacing: 0.5,
              }}
            >
              NPR {amount}
            </Title>
            <Text style={{ color: "#6B7280", fontSize: 12 }}>
              LakeSide Hotel Booking
            </Text>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text style={{ color: "#D1D5DB", fontSize: 12 }}>
            Select payment method
          </Text>
          <Radio.Group
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ marginTop: 8, width: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Radio value="wallet" style={{ color: "#E5E7EB" }}>
                <Space>
                  <FaWallet color="#22C55E" />
                  <span>Khalti Wallet</span>
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text style={{ color: "#D1D5DB", fontSize: 12 }}>
            Khalti mobile number
          </Text>
          <Input
            placeholder="98XXXXXXXX"
            maxLength={10}
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
            }
            style={{
              marginTop: 6,
              backgroundColor: "#020617",
              borderColor: "#4B5563",
              color: "#E5E7EB",
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text style={{ color: "#D1D5DB", fontSize: 12 }}>Khalti PIN</Text>
          <Input.Password
            placeholder="4 digit PIN"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
            style={{
              marginTop: 6,
              backgroundColor: "#020617",
              borderColor: "#4B5563",
              color: "#E5E7EB",
            }}
            iconRender={(visible) => (
              <FaLock color={visible ? "#22C55E" : "#6B7280"} />
            )}
          />
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{
              marginBottom: 12,
              backgroundColor: "#7F1D1D",
              borderColor: "#FCA5A5",
              color: "#FEE2E2",
            }}
          />
        )}

        <Button
          type="primary"
          block
          size="large"
          loading={isPaying}
          onClick={handlePay}
          style={{
            marginTop: 4,
            background: "linear-gradient(135deg, #7C3AED, #6366F1, #EC4899)",
            border: "none",
            boxShadow: "0 12px 25px rgba(129, 140, 248, 0.6)",
          }}
        >
          {isPaying ? "Processing payment..." : "Pay with Khalti (Demo)"}
        </Button>

        <div
          style={{
            marginTop: 12,
            textAlign: "center",
            fontSize: 11,
            color: "#6B7280",
          }}
        >
          This is a demo payment screen. No real transaction will be made.
        </div>
      </Card>
    </div>
  );
};

export default KhaltiMockPayment;
