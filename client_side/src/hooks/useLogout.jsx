import { useDispatch } from "react-redux";
import { useNavigation } from "react-router-dom"
import { logout } from '../redux/userSlice'

export default function Logout() {
    const navigate = useNavigation();
    const dispatch = useDispatch();

    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
    return;
}