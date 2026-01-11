import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useOAuthFlow } from "@/hooks/useOAuthFlow";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export const Login = () => {
  const { login, googleLoginHandler, loading, error, clearAuthError } =
    useAuth();
  const { handleCallback: handleSocialCallback } = useOAuthFlow();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
      try {
        const pendingCode = sessionStorage.getItem("pending_oauth_code");
        const pendingPlatform = sessionStorage.getItem("pending_oauth_platform");

      await login(formData);

      if (pendingCode && pendingPlatform) {
        setIsProcessingOAuth(true);
        try {
          await handleSocialCallback(pendingCode);

          // Clear pending OAuth data
          sessionStorage.removeItem("pending_oauth_code");
          sessionStorage.removeItem("pending_oauth_platform");

          // Redirect to social accounts page
            setTimeout(() => navigate("/social-accounts", { replace: true }), 500);
        } catch (oauthError) {
          console.error("Failed to connect social account:", oauthError);
            // Still redirect to dashboard
            setTimeout(() => navigate("/dashboard", { replace: true }), 500);
        }
        } else {
          // Normal login - will navigate to dashboard via useAuth
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    // Check if coming from OAuth pending state
    if (searchParams.get("oauth_pending")) {
      clearAuthError();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md text-center">
            {error}
          </div>
        )}

        {isProcessingOAuth && (
          <div className="mb-4 p-3 text-sm text-blue-500 bg-blue-50 rounded-md text-center">
            Connecting social account...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            disabled={isProcessingOAuth}
          />

          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            disabled={isProcessingOAuth}
          />

          <Button 
            type="submit" 
            disabled={loading || isProcessingOAuth} 
            className="w-full"
          >
            {isProcessingOAuth ? "Connecting account..." : loading ? "Logging in..." : "Log In"}
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={googleLoginHandler}
            disabled={loading || isProcessingOAuth}
            className="w-full"
          >
            {loading || isProcessingOAuth ? "Processing..." : "Log In with Google"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};
