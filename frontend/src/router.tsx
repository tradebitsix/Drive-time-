import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./ui/app-layout";
import { LoginPage } from "./views/login";
import { DashboardPage } from "./views/dashboard";
import { StudentsPage } from "./views/students";
import { ProtectedRoute } from "./ui/protected";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "students", element: <StudentsPage /> },
    ],
  },
]);
