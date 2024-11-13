import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";

const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        {
            path: "register",
            element: <RegisterPage />
        },
        {
            path: "login",
            element: <LoginPage />
        },
        {
            path: "/",
            element: <HomePage />
        },
    ]
}]);

export default router;