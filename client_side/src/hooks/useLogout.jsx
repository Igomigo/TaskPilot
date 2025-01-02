import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { logout } from '../redux/userSlice'

export default function useLogout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem("token");
        console.log("logout function called");
        dispatch(logout());
        navigate("/login");
    };

    return handleLogout;
}