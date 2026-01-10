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

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

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
    "/analytics",
    "/social-accounts",
    "/preferences",
    "/profile",
  ];

  const showSidebar =
    isAuthenticated &&
    protectedRoutes.some((route) => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar
        user={user}
        onLogout={logout}
        onMenuClick={toggleMobileSidebar}
        isAuthenticated={isAuthenticated}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Layout Container */}
      <div className="flex pt-16">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
              <Sidebar user={user} onCollapse={handleSidebarCollapse} />
            </div>

            {/* Mobile Sidebar */}
            <div
              className={cn(
                "fixed left-0 top-16 bottom-0 w-72 bg-white border-r border-gray-200 z-50 md:hidden transition-transform duration-300 ease-in-out",
                isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <Sidebar
                user={user}
                onCollapse={handleSidebarCollapse}
                onNavigate={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </>
        )}

        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out",
            showSidebar ? (sidebarCollapsed ? "md:ml-20" : "md:ml-72") : "ml-0"
          )}
        >
          <div className="h-full">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto py-6">
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
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
