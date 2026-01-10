import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Welcome to{" "}
          <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            SocialBoost AI
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
          Experience the best features and seamless performance. Join us today
          and be part of our growing community!
        </p>
        {!isAuthenticated && (
          <div className="flex gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
