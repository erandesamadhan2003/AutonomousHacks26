import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useOAuthFlow } from "@/hooks/useOAuthFlow";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Lock, Mail, Sparkles, Eye, EyeOff } from "lucide-react";

export const Login = () => {
  const { login, googleLoginHandler, loading, error, clearAuthError } =
    useAuth();
  const { handleCallback: handleSocialCallback } = useOAuthFlow();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          sessionStorage.removeItem("pending_oauth_code");
          sessionStorage.removeItem("pending_oauth_platform");
          setTimeout(
            () => navigate("/social-accounts", { replace: true }),
            500
          );
        } catch (oauthError) {
          console.error("Failed to connect social account:", oauthError);
          setTimeout(() => navigate("/dashboard", { replace: true }), 500);
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    if (searchParams.get("oauth_pending")) {
      clearAuthError();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-200/30 rounded-full blur-3xl top-10 left-10 animate-pulse" />
        <div
          className="absolute w-96 h-96 bg-pink-200/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-xl">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue creating amazing content
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-900">Error</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {isProcessingOAuth && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
              <p className="text-sm text-blue-900 font-medium">
                Connecting social account...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isProcessingOAuth}
                  className="pl-12 py-6 border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={isProcessingOAuth}
                  className="pl-12 pr-12 py-6 border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading || isProcessingOAuth}
              className="w-full py-6 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {isProcessingOAuth
                ? "Connecting account..."
                : loading
                ? "Signing in..."
                : "Sign In"}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500 font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
              onClick={googleLoginHandler}
              disabled={loading || isProcessingOAuth}
              className="w-full py-6 border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading || isProcessingOAuth
                ? "Processing..."
                : "Sign in with Google"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-bold text-purple-600 hover:text-purple-700 transition-colors"
            >
              Create Account
            </a>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-700">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};
