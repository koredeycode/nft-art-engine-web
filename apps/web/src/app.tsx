import { createBrowserRouter, RouterProvider } from "react-router";
import { DashboardPage, loader as dashboardLoader } from "@/pages/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
    loader: dashboardLoader,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
