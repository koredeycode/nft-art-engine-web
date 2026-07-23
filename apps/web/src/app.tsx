import { useSession } from "@/lib/auth-client";
import { AuthPage } from "@/pages/auth";
import { DashboardPage, loader as dashboardLoader } from "@/pages/dashboard";
import { LandingPage } from "@/pages/landing";
import { ProjectPage, loader as projectLoader } from "@/pages/project";
import { Navigate, RouterProvider, createBrowserRouter, useRouteError } from "react-router";

function ErrorBoundary() {
  const error = useRouteError();
  console.error("Caught route error, redirecting to /auth:", error);
  return <Navigate to="/auth" replace />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-sans">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span>Authenticating session...</span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
    loader: dashboardLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/projects/:id",
    element: (
      <ProtectedRoute>
        <ProjectPage />
      </ProtectedRoute>
    ),
    loader: projectLoader,
    errorElement: <ErrorBoundary />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
