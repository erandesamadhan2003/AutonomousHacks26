import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

export const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Close mobile sidebar on route change or when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  // Routes where sidebar should be shown
  const protectedRoutes = [
    "/dashboard",
    "/create-post",
    "/drafts",
    "/published",
    "/scheduled",
    "/analytics",
    "/insights",
    "/social-accounts",
    "/preferences",
    "/profile",
    "/notifications",
    "/tools",
    "/pricing",
  ];

  const showSidebar =
    isAuthenticated &&
    protectedRoutes.some((route) => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      {/* Navbar */}
      <Navbar
        user={user}
        onLogout={logout}
        onMenuClick={toggleMobileSidebar}
        isAuthenticated={isAuthenticated}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && isAuthenticated && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Layout Container */}
      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <div
              className={cn(
                "hidden md:block w-64 fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 overflow-y-auto",
                isMobileSidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0"
              )}
            >
              <Sidebar
                user={user}
                isMobileOpen={isMobileSidebarOpen}
                onCollapse={handleSidebarCollapse}
              />
            </div>

            {/* Mobile Sidebar */}
            {isMobileSidebarOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-50 md:hidden">
                  <Sidebar
                    user={user}
                    isMobileOpen={isMobileSidebarOpen}
                    onCollapse={handleSidebarCollapse}
                    onNavigate={() => setIsMobileSidebarOpen(false)}
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            isAuthenticated
              ? sidebarCollapsed
                ? "md:ml-20"
                : "md:ml-72"
              : "ml-0"
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            {/* Scrollable Content Area */}
            <div className="min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>

            {/* Footer */}
            <footer className="mt-12 py-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                <p>© 2024 SocialBoost AI. All rights reserved.</p>
                <div className="flex gap-6">
                  <a
                    href="/terms"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Terms
                  </a>
                  <a
                    href="/privacy"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Privacy
                  </a>
                  <a
                    href="/support"
                    className="hover:text-purple-600 transition-colors"
                  >
                    Support
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
