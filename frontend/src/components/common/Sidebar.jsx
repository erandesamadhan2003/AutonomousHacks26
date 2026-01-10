import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PenTool,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Plus,
  BarChart3,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: PenTool,
    label: "Create Post",
    path: "/create-post",
  },
  {
    icon: FileText,
    label: "Drafts",
    path: "/drafts",
  },
  {
    icon: CheckCircle,
    label: "Published",
    path: "/published",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/analytics",
  },
  {
    icon: Share2,
    label: "Social Accounts",
    path: "/social-accounts",
  },
];

export const Sidebar = ({ user, onCollapse, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (onCollapse) {
      onCollapse(isCollapsed);
    }
  }, [isCollapsed, onCollapse]);

  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-sm flex flex-col",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleCollapse}
        className="absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:shadow-md transition-all hidden md:flex"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </Button>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        {/* Navigation Menu */}
        <nav className="space-y-1 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-11 transition-all duration-200",
                  isCollapsed ? "px-3" : "px-4",
                  active
                    ? "bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                onClick={() => handleNavigation(item.path)}
                title={isCollapsed ? item.label : ""}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active && "text-purple-600"
                  )}
                />
                {!isCollapsed && (
                  <span className="flex-1 text-left font-medium">
                    {item.label}
                  </span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Connect Account CTA */}
        {!isCollapsed && (
          <>
            <Separator className="my-4" />
            <div className="p-4 rounded-xl bg-linear-to-br from-purple-500 via-pink-500 to-rose-500 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-white" />
                <h3 className="font-bold text-white">Grow Your Reach</h3>
              </div>
              <p className="mb-4 text-xs text-purple-50 leading-relaxed">
                Connect more social accounts to maximize your content
                distribution
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold shadow-sm"
                onClick={() => handleNavigation("/social-accounts")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Account
              </Button>
            </div>
          </>
        )}
      </div>

      {/* User Profile Section - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-white">
        <div
          className={cn(
            "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
            isCollapsed && "px-3"
          )}
          onClick={() => handleNavigation("/preferences")}
        >
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed && "justify-center"
            )}
          >
            <Avatar className="h-10 w-10 border-2 border-purple-200 shadow-sm">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-linear-to-br from-purple-400 to-pink-400 text-white font-semibold">
                {getInitials(user?.name || user?.fullName)}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || user?.fullName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
