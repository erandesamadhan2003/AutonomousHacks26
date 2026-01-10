import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import CommonMainLayout from "@/components/common/MainLayout";

export const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <CommonMainLayout>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {isAuthenticated ? (
          <>
            <Sidebar isMobileOpen={isMobileSidebarOpen} />
            <main className="pt-16 transition-all duration-300">
              <div className="max-w-7xl mx-auto p-6">
                <Outlet />
              </div>
            </main>
          </>
        ) : (
          <main className="pt-16">
            <div className="container mx-auto p-6">
              <Outlet />
            </div>
          </main>
        )}
      </div>
    </CommonMainLayout>
  );
};
