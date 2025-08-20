import { useEffect, useState } from "react";
import moment from "moment";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Button,
  Typography,
  Card,
} from "antd";
import toast from "react-hot-toast";
import BookingSummary from "./BookingSummary";
import { bookRoom, getRoomById, getRoomPricing } from "../utils/ApiFunctions";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { GMAIL_REGEX } from "../utils/constants";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const BookingForm = () => {
  const [form] = Form.useForm();
  const [roomPrice, setRoomPrice] = useState(0);
  const [dynamicPricing, setDynamicPricing] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentUser = localStorage.getItem("userId");
  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: currentUser,
    checkInDate: "",
    checkOutDate: "",
    numOfAdults: 1,
    numOfChildren: 0,
    phoneNumber: "",
  });

  const [searchParams] = useSearchParams();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const fetchDynamicPricing = async (checkIn, checkOut) => {
    try {
      const pricing = await getRoomPricing(roomId, checkIn, checkOut);
      setDynamicPricing(pricing);
    } catch {
      setDynamicPricing(null);
      toast.error("Unable to fetch pricing. Using base price.");
    }
  };

  const getRoomPriceById = async (id) => {
    try {
      const response = await getRoomById(id);
      setRoomPrice(response.roomPrice);
    } catch (err) {
      toast.error("Failed to fetch room price");
    }
  };

  useEffect(() => {
    getRoomPriceById(roomId);

    const checkInFromParams = searchParams.get("checkIn");
    const checkOutFromParams = searchParams.get("checkOut");

    if (checkInFromParams && checkOutFromParams) {
      setBooking((prev) => ({
        ...prev,
        checkInDate: checkInFromParams,
        checkOutDate: checkOutFromParams,
      }));
      fetchDynamicPricing(checkInFromParams, checkOutFromParams);
    }
  }, [roomId, searchParams]);

  const calculatePayment = () => {
    const diffInDays = moment(booking.checkOutDate).diff(
      moment(booking.checkInDate),
      "days"
    );
    const pricePerDay = dynamicPricing ? dynamicPricing.finalPrice : roomPrice;
    return diffInDays * pricePerDay;
  };

  const onDateChange = (dates) => {
    if (!dates || dates.length !== 2) {
      setBooking((prev) => ({ ...prev, checkInDate: "", checkOutDate: "" }));
      setDynamicPricing(null);
      return;
    }

    const checkIn = dates[0].format("YYYY-MM-DD");
    const checkOut = dates[1].format("YYYY-MM-DD");

    if (moment(checkOut).isSameOrBefore(moment(checkIn))) {
      setErrorMessage("Check-out date must be after check-in date");
      toast.error("Check-out date must be after check-in date");
      return;
    }
    setErrorMessage("");

    setBooking((prev) => ({
      ...prev,
      checkInDate: checkIn,
      checkOutDate: checkOut,
    }));
    fetchDynamicPricing(checkIn, checkOut);
  };

  const onFinish = () => {
    setIsSubmitted(true);
  };

  const handleConfirm = async () => {
    try {
      const confirmationCode = await bookRoom(roomId, booking);
      toast.success("Booking confirmed successfully!");
      navigate("/booking-success", { state: { message: confirmationCode } });
    } catch (err) {
      toast.error("Booking failed. Please try again.");
      navigate("/booking-success", { state: { error: err.message } });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", gap: "2rem" }}>
        <Card style={{ flex: 1 }}>
          <Title level={4}>Reserve Room</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              guestEmail: currentUser,
              numOfAdults: 1,
              numOfChildren: 0,
              phoneNumber: "",
            }}
          >
            <Form.Item
              label="Full Name"
              name="guestFullName"
              rules={[
                { required: true, message: "Please enter your fullname" },
              ]}
            >
              <Input
                placeholder="Enter your fullname"
                onChange={(e) =>
                  setBooking({ ...booking, guestFullName: e.target.value })
                }
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="guestEmail"
              rules={[
                { required: true, message: "Please enter your email!" },
                {
                  pattern: GMAIL_REGEX,
                  message:
                    "Use a valid Gmail address, e.g. john.doe+notes@gmail.com",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Phone Number" name="phoneNumber">
              <InputNumber
                min={10}
                max={10}
                placeholder="Enter your phone number"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item label="Lodging Period" required>
              <RangePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                onChange={onDateChange}
                disabledDate={(current) =>
                  current && current < moment().startOf("day")
                }
              />
              {errorMessage && (
                <span style={{ color: "red" }}>{errorMessage}</span>
              )}
            </Form.Item>

            <Form.Item
              label="Number of adults and children"
              style={{ marginBottom: 0 }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <Form.Item
                  name="numOfAdults"
                  rules={[
                    {
                      required: true,
                      type: "number",
                      min: 1,
                      message: "At least 1 adult",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    placeholder="Adults"
                    onChange={(value) =>
                      setBooking({ ...booking, numOfAdults: value })
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="numOfChildren"
                  rules={[{ required: true, type: "number", min: 0 }]}
                >
                  <InputNumber
                    min={0}
                    placeholder="Children"
                    onChange={(value) =>
                      setBooking({ ...booking, numOfChildren: value })
                    }
                  />
                </Form.Item>
              </div>
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Continue
            </Button>
          </Form>
        </Card>

        <div style={{ flex: 1 }}>
          {isSubmitted ? (
            <BookingSummary
              booking={booking}
              payment={calculatePayment()}
              onConfirm={handleConfirm}
              isFormValid={true}
              dynamicPricing={dynamicPricing}
            />
          ) : (
            <div className="w-100 h-100 bg-body-secondary text-center flex-column align-content-center">
              Continue to View your booking summary
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
