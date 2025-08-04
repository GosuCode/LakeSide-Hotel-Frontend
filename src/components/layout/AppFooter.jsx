import { Layout } from "antd";
import { useLocation } from "react-router-dom";

const { Footer } = Layout;

const AppFooter = () => {
  const location = useLocation();

  // Hide footer on admin routes
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <Footer style={{ textAlign: "center" }}>
      © {new Date().getFullYear()} lakeSide Hotel. All rights reserved.
    </Footer>
  );
};

export default AppFooter;
