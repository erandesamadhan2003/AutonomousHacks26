import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PenTool,
  FileText,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Plus,
  BarChart3,
  Lightbulb,
  Share2,
  Image,
  Video,
  Music,
  Users,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    icon: Calendar,
    label: "Scheduled",
    path: "/scheduled",
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
    icon: Lightbulb,
    label: "Insights",
    path: "/insights",
  },
  {
    icon: Share2,
    label: "Social Accounts",
    path: "/social-accounts",
  },
];

const toolsItems = [
  {
    label: "Image Editor",
    icon: Image,
    path: "/tools/image-editor",
  },
  {
    label: "Video Generator",
    icon: Video,
    path: "/tools/video-generator",
  },
  {
    label: "Music Suggestions",
    icon: Music,
    path: "/tools/music",
  },
];

export const Sidebar = ({ user, isMobileOpen, onCollapse }) => {
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

  const quickStats = [
    {
      icon: FileText,
      label: "Total Posts",
      value: "24",
      color: "text-purple-600",
    },
    { icon: Heart, label: "Engagement", value: "1.2K", color: "text-pink-600" },
    { icon: Users, label: "Accounts", value: "3", color: "text-emerald-600" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-linear-to-b from-gray-50 to-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-lg",
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

        <ScrollArea className="h-full py-6">
          <div className="space-y-6 px-3">
            {/* Navigation Menu */}
            <nav className="space-y-1">
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
                      <>
                        <span className="flex-1 text-left font-medium">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-xs font-semibold text-white shadow-sm">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                );
              })}
            </nav>

            {!isCollapsed && (
              <>
                <Separator className="bg-gray-200" />

                {/* Quick Stats */}
                <div className="space-y-3">
                  <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Quick Stats
                  </h3>
                  <div className="space-y-2">
                    {quickStats.map((stat) => {
                      const StatIcon = stat.icon;
                      return (
                        <div
                          key={stat.label}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-gray-100 to-gray-50 shadow-sm">
                            <StatIcon className={cn("h-5 w-5", stat.color)} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">
                              {stat.label}
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              {stat.value}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* Connect Account CTA */}
                <div className="mx-3 p-4 rounded-xl bg-linear-to-br from-purple-500 via-pink-500 to-rose-500 shadow-lg hover:shadow-xl transition-shadow">
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
                    onClick={() => navigate("/social-accounts")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Account
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* User Profile Section */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
            <div
              className={cn(
                "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                isCollapsed && "px-3"
              )}
              onClick={() => navigate("/preferences")}
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
        </ScrollArea>
      </aside>

      {/* Spacer for content */}
      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-20" : "ml-72"
        )}
      />
    </>
  );
};

export default Sidebar;
