import { Star, Wifi, Car, Coffee, Utensils, Calendar } from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { DatePicker, Button, Space, Typography } from "antd";
import { getRoomPricing } from "../utils/ApiFunctions";
import PricingDisplay from "../common/PricingDisplay";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const RoomCard = ({ room }) => {
  const [pricing, setPricing] = useState(null);
  const [selectedDates, setSelectedDates] = useState(null);
  const [loading, setLoading] = useState(false);

  const amenityIcons = {
    wifi: <Wifi className="w-4 h-4" />,
    parking: <Car className="w-4 h-4" />,
    coffee: <Coffee className="w-4 h-4" />,
    restaurant: <Utensils className="w-4 h-4" />,
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const handleDateChange = async (dates) => {
    if (!dates || dates.length !== 2) {
      setPricing(null);
      setSelectedDates(null);
      return;
    }

    setSelectedDates(dates);
    setLoading(true);

    try {
      const checkIn = dates[0].format("YYYY-MM-DD");
      const checkOut = dates[1].format("YYYY-MM-DD");

      const pricingData = await getRoomPricing(room.id, checkIn, checkOut);
      setPricing(pricingData);
    } catch (error) {
      console.error("Error fetching pricing:", error);
      setPricing(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-64 h-48 md:h-auto overflow-hidden">
          <Link to={`/book-room/${room.id}`}>
            <img
              src={room.photo || "/placeholder.svg"}
              alt={`${room.roomType} room`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target;
                target.src = "/placeholder.svg?height=200&width=300";
              }}
            />
          </Link>
          {room.rating && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <div className="flex">{renderStars(room.rating)}</div>
              <span className="text-sm font-medium text-gray-700">
                {room.rating}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {room.roomType}
                </h3>
                <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                  <span className="text-sm text-gray-500 font-normal">
                    from
                  </span>
                  ${room.roomPrice}
                  <span className="text-sm text-gray-500 font-normal">
                    / night
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {room.description ||
                "Experience luxury and comfort in this beautifully appointed room featuring modern amenities and elegant furnishings for the perfect stay."}
            </p>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {room.amenities.slice(0, 4).map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 rounded-full px-3 py-1"
                  >
                    {amenityIcons[amenity.toLowerCase()] || (
                      <div className="w-4 h-4 bg-gray-300 rounded-full" />
                    )}
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
                {room.amenities.length > 4 && (
                  <div className="flex items-center text-sm text-gray-500">
                    +{room.amenities.length - 4} more
                  </div>
                )}
              </div>
            )}

            {/* Date Selection and Pricing */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <Text strong>Check Pricing:</Text>
              </div>
              <RangePicker
                onChange={handleDateChange}
                placeholder={["Check-in", "Check-out"]}
                style={{ width: "100%" }}
                disabled={loading}
              />
            </div>

            {/* Dynamic Pricing Display */}
            {pricing && (
              <PricingDisplay pricing={pricing} showDetails={false} />
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Free cancellation • Pay later
            </div>
            <Space>
              {pricing && (
                <Link
                  to={`/book-room/${
                    room.id
                  }?checkIn=${selectedDates?.[0]?.format(
                    "YYYY-MM-DD"
                  )}&checkOut=${selectedDates?.[1]?.format("YYYY-MM-DD")}`}
                >
                  <Button type="primary" size="small">
                    Book at ${pricing.finalPrice}
                  </Button>
                </Link>
              )}
              <Link to={`/book-room/${room.id}`}>
                <Button size="small">Book Now</Button>
              </Link>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number.isRequired,
    photo: PropTypes.string.isRequired,
    roomType: PropTypes.string.isRequired,
    roomPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    rating: PropTypes.number,
    description: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
