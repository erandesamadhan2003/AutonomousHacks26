import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import "./App.css";
import { Home } from "./pages/Home";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import DashboardPage from "./pages/Dashboard";
import { useSelector } from "react-redux";
import { AuthCallBack } from "./pages/auth/AuthCallBack";
import MainLayout from "./components/common/MainLayout";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  if (token && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "auth/callback",
        element: <AuthCallBack />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-post",
        element: (
          <ProtectedRoute>
            <div>Create Post Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "drafts",
        element: (
          <ProtectedRoute>
            <div>Drafts Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "published",
        element: (
          <ProtectedRoute>
            <div>Published Posts Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "scheduled",
        element: (
          <ProtectedRoute>
            <div>Scheduled Posts Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute>
            <div>Analytics Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "insights",
        element: (
          <ProtectedRoute>
            <div>Insights Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "social-accounts",
        element: (
          <ProtectedRoute>
            <div>Social Accounts Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "preferences",
        element: (
          <ProtectedRoute>
            <div>Preferences Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <div>Profile Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <div>Notifications Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "tools/image-editor",
        element: (
          <ProtectedRoute>
            <div>Image Editor Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "tools/video-generator",
        element: (
          <ProtectedRoute>
            <div>Video Generator Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "tools/music",
        element: (
          <ProtectedRoute>
            <div>Music Suggestions Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "pricing",
        element: (
          <ProtectedRoute>
            <div>Pricing Page</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={Router} />;
}

export default App;
