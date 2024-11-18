import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import BoardsPage from "../pages/BoardsPage";
import BoardPage from "../pages/BoardPage";
import ProfilePage from "../pages/ProfilePage";

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
            path: "",
            element: <HomePage />
        },
        {
            path: "boards",
            element: <BoardsPage />,
            children: [
                {
                    path: ":boardId",
                    element: <BoardPage />
                },
            ]
        },
        {
            path: "profile/:username",
            element: <ProfilePage />
        }
    ]
}]);

export default router;