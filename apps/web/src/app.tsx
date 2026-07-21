import { createBrowserRouter, RouterProvider } from "react-router";
import {
  DashboardPage,
  loader as dashboardLoader,
} from "@/pages/dashboard";
import { ProjectPage, loader as projectLoader } from "@/pages/project";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
    loader: dashboardLoader,
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
