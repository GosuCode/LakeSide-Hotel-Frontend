import MainHeader from "../layout/MainHeader";
import HotelsList from "../common/HotelsList";
import Parallax from "../common/Parallax";
import RoomCarousel from "../common/RoomCarousel";
import RoomSearch from "../common/RoomSearch";

const Home = () => {
  return (
    <section>
      <MainHeader />
      <div className="container">
        <RoomSearch />
        <RoomCarousel />
        <Parallax />
        <HotelsList />
      </div>
    </section>
  );
};

export default Home;
