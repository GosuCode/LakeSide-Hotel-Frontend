import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./components/home/Home";
import NavBar from "./components/layout/NavBar";
import RoomListing from "./components/room/RoomListing";
import RoomDetails from "./components/room/RoomDetails";
import HotelDetails from "./components/hotel/HotelDetails";
import BookingSuccess from "./components/booking/BookingSuccess";
import Bookings from "./components/booking/Bookings";
import FindBooking from "./components/booking/FindBooking";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Profile from "./components/auth/Profile";
import { AuthProvider } from "./components/auth/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
import AdminDashboard from "./dashboard";
import AppFooter from "./components/layout/AppFooter";
import Checkout from "./components/booking/Checkout";
import MainFooter from "./components/layout/MainFooter";

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
            <Route path="/browse-all-rooms" element={<RoomListing />} />
            <Route path="/book-room/:roomId" element={<Checkout />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/existing-bookings" element={<Bookings />} />
            <Route path="/find-booking" element={<FindBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<FindBooking />} />
          </Routes>
          <MainFooter />
          <AppFooter />
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
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
