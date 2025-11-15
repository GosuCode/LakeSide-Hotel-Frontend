import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9192",
});

export const getHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getJsonHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function addRoom(roomData) {
  const headers = getJsonHeader();

  const response = await api.post("/rooms/add/new-room", roomData, {
    headers: headers,
  });
  return response.status === 200 || response.status === 201;
}

/* This function gets all room types from thee database */
export async function getRoomTypes() {
  try {
    const response = await api.get("/rooms/room/types");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching room types");
  }
}
/* This function gets all rooms from the database */
export async function getAllRooms() {
  try {
    const result = await api.get("/rooms/all-rooms");
    return result.data;
  } catch (error) {
    throw new Error("Error fetching rooms");
  }
}

/* This function deletes a room by the Id */
export async function deleteRoom(roomId) {
  try {
    const result = await api.delete(`/rooms/delete/room/${roomId}`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error deleting room ${error.message}`);
  }
}
/* This function update a room */
export async function updateRoom(roomId, roomData) {
  const updateData = {
    roomType: roomData.roomType,
    roomPrice: roomData.roomPrice,
    photoUrl: roomData.photoUrl,
    bedType: roomData.bedType,
    roomNumber: roomData.roomNumber,
    description: roomData.description,
    roomCategory: roomData.roomCategory,
    amenities: roomData.amenities,
    isBooked: roomData.isBooked,
    hotel: roomData.hotel,
  };

  const headers = getJsonHeader();
  const response = await api.put(`/rooms/update-full/${roomId}`, updateData, {
    headers,
  });
  return response;
}

/* Hotel API Functions */

/* This function adds a new hotel to the database */
export async function addHotel(hotelData) {
  try {
    const response = await api.post("/api/v1/hotels/add", hotelData, {
      headers: getJsonHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error adding hotel");
  }
}

/* This function gets all hotels from the database */
export async function getAllHotels() {
  try {
    const response = await api.get("/api/v1/hotels/all");
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching hotels: ${error.message}`);
  }
}

/* This function gets a hotel by ID */
export async function getHotelById(hotelId) {
  try {
    const response = await api.get(`/api/v1/hotels/${hotelId}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching hotel");
  }
}

/* This function updates a hotel */
export async function updateHotel(hotelId, hotelData) {
  try {
    const response = await api.put(
      `/api/v1/hotels/update/${hotelId}`,
      hotelData,
      {
        headers: getJsonHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error updating hotel");
  }
}

/* This function deletes a hotel */
export async function deleteHotel(hotelId) {
  try {
    const response = await api.delete(`/api/v1/hotels/delete/${hotelId}`, {
      headers: getHeader(),
    });
    return response.status === 204;
  } catch (error) {
    throw new Error("Error deleting hotel");
  }
}

/* This function searches hotels */
export async function searchHotels(name, address) {
  try {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (address) params.append("address", address);

    const response = await api.get(`/api/v1/hotels/search?${params}`);
    return response.data;
  } catch (error) {
    throw new Error("Error searching hotels");
  }
}

/* This funcction gets a room by the id */
export async function getRoomById(roomId) {
  try {
    const result = await api.get(`/rooms/room/${roomId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching room ${error.message}`);
  }
}

/* This function saves a new booking to the databse */
export async function bookRoom(roomId, booking) {
  try {
    const response = await api.post(
      `/bookings/room/${roomId}/booking`,
      booking,
      {
        headers: getJsonHeader(),
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking room : ${error.message}`);
    }
  }
}

export async function getAllBookings() {
  try {
    const result = await api.get("/bookings/all-bookings", {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching bookings : ${error.message}`);
  }
}

export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`);
    return result.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error find booking : ${error.message}`);
    }
  }
}

export async function cancelBooking(bookingId) {
  try {
    const result = await api.delete(`/bookings/booking/${bookingId}/delete`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error cancelling booking :${error.message}`);
  }
}

export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  const result = await api.get(
    `/rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
  );
  return result;
}

export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error : ${error.message}`);
    }
  }
}
export async function loginUser(login) {
  try {
    const response = await api.post("/auth/login", login, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

/*  This is function to get the user profile */
export async function getUserProfile(userId) {
  const response = await api.get(`users/profile/${userId}`, {
    headers: getHeader(),
  });
  return response.data;
}

/* This isthe function to delete a user */
export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}

/* This is the function to get a single user */
export async function getUser(userId) {
  const response = await api.get(`/users/${userId}`, {
    headers: getHeader(),
  });
  return response.data;
}

/* This is the function to get user bookings by the user id */
export async function getBookingsByUserId(userId) {
  const response = await api.get(`/bookings/user/${userId}/bookings`, {
    headers: getHeader(),
  });
  return response.data;
}

/* This function gets room pricing with dynamic adjustments */
export async function getRoomPricing(roomId, checkIn, checkOut) {
  try {
    const response = await api.get(`/rooms/pricing/${roomId}`, {
      params: { checkIn, checkOut },
      headers: getHeader(),
    });

    // console.log("🔍 API Debug - Backend response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error(
        "Authentication required. Please log in to view pricing."
      );
    } else if (error.response?.status === 400) {
      throw new Error("Invalid request. Please check your dates.");
    } else if (error.response?.status === 404) {
      throw new Error("Room not found.");
    } else {
      throw new Error("Error fetching room pricing. Please try again.");
    }
  }
}

/* This function gets all rooms with pricing for a date range */
export async function getRoomsWithPricing(checkIn, checkOut, roomType = null) {
  try {
    const params = { checkIn, checkOut };
    if (roomType) params.roomType = roomType;

    const response = await api.get("/rooms/search-with-pricing", {
      params,
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching rooms with pricing");
  }
}

/* Dashboard API Functions */
export async function getDashboardStats() {
  try {
    const response = await api.get("/dashboard/stats", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching dashboard stats: ${error.message}`);
  }
}

export async function getBookingsByMonth() {
  try {
    const response = await api.get("/dashboard/bookings-by-month", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching monthly bookings: ${error.message}`);
  }
}

export async function getRoomOccupancy() {
  try {
    const response = await api.get("/dashboard/room-occupancy", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching room occupancy: ${error.message}`);
  }
}

export async function getRecentBookings() {
  try {
    const response = await api.get("/dashboard/recent-bookings", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching recent bookings: ${error.message}`);
  }
}

export async function getTopPerformingHotels() {
  try {
    const response = await api.get("/dashboard/top-performing-hotels", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching top hotels: ${error.message}`);
  }
}
