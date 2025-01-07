import { Navigate } from "react-router-dom";

const AuthProtectedRouteSign = ({ children }) => {
    console.log(children,"=======children");
    const token = localStorage.getItem('token');
    if (token) {
        return <Navigate to="/user/profile" />;
    }
    return children;
};
    
export default AuthProtectedRouteSign;