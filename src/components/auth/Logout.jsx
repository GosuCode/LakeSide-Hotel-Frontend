import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import toast from "react-hot-toast";

const Logout = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.handleLogout();
    toast.success("Logged out successfully! See you soon!");
    navigate("/");
  };

  return (
    <Button className="dropdown-item" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
