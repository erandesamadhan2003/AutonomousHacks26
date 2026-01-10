import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Bell,
  Sun,
  Moon,
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = ({
  user,
  onLogout,
  onMenuClick,
  isAuthenticated = false,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount] = useState(3);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const confirmRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (confirmRef.current && !confirmRef.current.contains(event.target)) {
        setShowLogoutConfirm(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowLogoutConfirm(false);
      }
    };

    if (showLogoutConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showLogoutConfirm]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-md"
            : "bg-white/70 backdrop-blur-sm border-b border-gray-200"
        )}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo & Menu */}
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMenuClick}
                  className="md:hidden hover:bg-purple-50"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </Button>
              )}

              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate("/")}
              >
                <div className="h-10 w-10 rounded-lg bg-linear-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:block">
                  SocialBoost AI
                </span>
              </div>
            </div>

            {/* Center Section - Search Bar */}
            {isAuthenticated && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search posts, accounts..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-300 focus:ring-purple-200 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-purple-50"
                    onClick={() => navigate("/notifications")}
                  >
                    <Bell className="h-5 w-5 text-gray-700" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-lg">
                        {notificationCount}
                      </span>
                    )}
                  </Button>

                  {/* Dark Mode Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="hover:bg-purple-50"
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5 text-gray-700" />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-700" />
                    )}
                  </Button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-purple-200 transition-all"
                      >
                        <Avatar className="h-10 w-10 border-2 border-purple-200">
                          <AvatarImage
                            src={user?.avatar}
                            alt={user?.name || user?.fullName}
                          />
                          <AvatarFallback className="bg-linear-to-br from-purple-400 to-pink-400 text-white font-semibold">
                            {getInitials(user?.name || user?.fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 mt-2 bg-white/95 backdrop-blur-lg"
                    >
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {user?.name || user?.fullName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/preferences")}
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/login")}
                    className="hover:bg-purple-50"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate("/signup")}
                    className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            ref={confirmRef}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout? You'll need to sign in again to
              access your account.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
