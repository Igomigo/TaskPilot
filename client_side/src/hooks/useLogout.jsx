import { useDispatch } from "react-redux";
import { useNavigation } from "react-router-dom"
import { logout } from '../redux/userSlice';

const navigate = useNavigation();
const dispatch = useDispatch();

export default function logout() {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
    return;
}