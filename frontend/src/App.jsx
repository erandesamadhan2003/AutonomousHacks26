import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import "./App.css";
import { Home } from "./pages/Home";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import DashboardPage from "./pages/Dashboard";
import DraftsPage from "./pages/DraftsPage";
import PublishedPostsPage from "./pages/PublishedPostsPage";
import { useSelector } from "react-redux";
import { AuthCallBack } from "./pages/auth/AuthCallBack";
import MainLayout from "./components/common/MainLayout";
import CreatePost from "./pages/CreatePost";
import AnalyticsPage from "./pages/AnalyticsPage";
import SocialAccountsPage from "./pages/SocialAccountsPage";
import PreferencesPage from "./pages/PreferencesPage";
import ProfilePage from "./pages/ProfilePage";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated, loading } = useSelector((state) => state.auth);

  // If we have a token but auth check is still loading, show loading state
  if (token && !isAuthenticated && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If we have a token but haven't verified yet, allow access temporarily
  // The useAuth hook will verify the token
  if (token && !isAuthenticated && !loading) {
    // Token exists but not authenticated yet - let useAuth verify it
    return children;
  }

  if (!token) {
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
            <CreatePost />
          </ProtectedRoute>
        ),
      },
      {
        path: "drafts",
        element: (
          <ProtectedRoute>
            <DraftsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "published",
        element: (
          <ProtectedRoute>
            <PublishedPostsPage />
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
            <AnalyticsPage />
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
            <SocialAccountsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "preferences",
        element: (
          <ProtectedRoute>
            <PreferencesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
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
