import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import BoardsPage from "../pages/BoardsPage";
import BoardPage from "../pages/BoardPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import Layout from "../layout/Layout";
import NotificationsPage from "../pages/NotificationsPage";
import ActivityLogPage from "../pages/ActivityLogPage";
import CardPage from "../pages/CardPage";
import BoardMembersPage from "../pages/BoardMembersPage";
import SendPasswordResetLink from "../pages/SendPasswordResetLink";
import PasswordResetPage from "../pages/PasswordResetPage";

const router = createBrowserRouter([{
    path: "/",
    element: <App />,
    children: [
        {
            path: "",
            element: <Layout />,
            children: [
                {
                    path: "",
                    element: <BoardsPage />,
                },
                {
                    path: "boards/:boardId",
                    element: <BoardPage />
                },
                {
                    path: "b/:listId/:cardTitle",
                    element: <CardPage />
                },
                {
                    path: "b/:boardId/members",
                    element: <BoardMembersPage />
                },
                {
                    path: "profile/:username",
                    element: <ProfilePage />
                },
                {
                    path: "settings",
                    element: <SettingsPage />
                },
                {
                    path: "notifications",
                    element: <NotificationsPage />
                },
                {
                    path: "activity-log",
                    element: <ActivityLogPage />
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
        },
        {
            path: "send-reset-link",
            element: <SendPasswordResetLink />
        },
        {
            path: "reset-password/:userId",
            element: <PasswordResetPage />
        }
    ]
}]);

export default router;