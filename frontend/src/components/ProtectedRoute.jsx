import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { authUser } = useAuthContext();

  // kalau belum login → redirect ke login
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // kalau roles diset dan role user tidak sesuai → redirect
  if (roles && !roles.includes(authUser.user.role)) {
    return <Navigate to="/dashboard" replace />; // bisa diarahkan ke landing dashboard
  }

  return children;
};

export default ProtectedRoute;
