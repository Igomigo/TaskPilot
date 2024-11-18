import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import BoardsPage from "../pages/BoardsPage";
import BoardPage from "../pages/BoardPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import Layout from "../layout/Layout";

const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        {
            path: "",
            element: <Layout />,
            children: [
                {
                    path: "boards",
                    element: <BoardsPage />,
                },
                {
                    path: "boards/:boardId",
                    element: <BoardPage />
                },
                {
                    path: "profile/:username",
                    element: <ProfilePage />
                },
                {
                    path: "settings",
                    element: <SettingsPage />
                }
            ]
        },
        {
            path: "register",
            element: <RegisterPage />
        },
        {
            path: "login",
            element: <LoginPage />
        }
    ]
}]);

export default router;