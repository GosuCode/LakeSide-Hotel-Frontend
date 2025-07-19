import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const RequireAuth = ({ children, adminOnly = false }) => {
  const user = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }

  if (adminOnly && userRole !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default RequireAuth;
