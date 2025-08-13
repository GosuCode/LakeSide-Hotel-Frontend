import MainHeader from "../layout/MainHeader";
import HotelService from "../common/HotelService";
import HotelsList from "../common/HotelsList";
import Parallax from "../common/Parallax";
import RoomCarousel from "../common/RoomCarousel";
import RoomSearch from "../common/RoomSearch";
import MainFooter from "../layout/MainFooter";

const Home = () => {
  return (
    <section>
      <MainHeader />
      <div className="container">
        <RoomSearch />
        <RoomCarousel />
        <Parallax />
        <HotelsList />
        <HotelService />
      </div>
      <MainFooter />
    </section>
  );
};

export default Home;
