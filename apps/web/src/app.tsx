import { createBrowserRouter, RouterProvider } from "react-router";
import {
  DashboardPage,
  loader as dashboardLoader,
} from "@/pages/dashboard";
import { ProjectPage, loader as projectLoader } from "@/pages/project";
import { AuthPage } from "@/pages/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
    loader: dashboardLoader,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/projects/:id",
    element: <ProjectPage />,
    loader: projectLoader,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

