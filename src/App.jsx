import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./components/home/Home";
import NavBar from "./components/layout/NavBar";
import RoomListing from "./components/room/RoomListing";
import RoomDetails from "./components/room/RoomDetails";
import HotelDetails from "./components/hotel/HotelDetails";
import HotelRooms from "./components/hotel/HotelRooms";
import NearbyHotelsSearch from "./components/hotel/NearbyHotelsSearch";
import BookingSuccess from "./components/booking/BookingSuccess";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Profile from "./components/auth/Profile";
import { AuthProvider } from "./components/auth/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
import AdminDashboard from "./dashboard";
import AppFooter from "./components/layout/AppFooter";
import Checkout from "./components/booking/Checkout";
import MainFooter from "./components/layout/MainFooter";
import YourBookings from "./components/booking/YourBookings";

function App() {
  return (
    <AuthProvider>
      <main>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin/*"
              element={
                <RequireAuth adminOnly>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route path="/room/:roomId" element={<RoomDetails />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/hotel/:hotelId/rooms" element={<HotelRooms />} />
            <Route path="/nearby-hotels" element={<NearbyHotelsSearch />} />
            <Route path="/browse-all-rooms" element={<RoomListing />} />
            <Route path="/book-room/:roomId" element={<Checkout />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/my-bookings" element={<YourBookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <MainFooter />
          <AppFooter />
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 1500,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </main>
    </AuthProvider>
  );
}

export default App;
