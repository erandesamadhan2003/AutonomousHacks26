import { useAuth } from "@/hooks/useAuth";
import { useOAuthFlow } from "@/hooks/useOAuthFlow";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";

export const AuthCallBack = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyAuthToken } = useAuth();
  const { token: storedToken, isAuthenticated } = useSelector((state) => state.auth);
  const { handleCallback: handleSocialCallback } = useOAuthFlow();
  const [status, setStatus] = useState("processing");
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple executions
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const token = searchParams.get("token");
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      // Check if user has token in localStorage (for social OAuth)
      let localToken = localStorage.getItem("token");
      
      // Restore auth token from sessionStorage if not in localStorage
      // This handles cross-domain OAuth redirects (e.g., localhost -> ngrok)
      const savedAuthToken = sessionStorage.getItem("oauth_auth_token");
      if (!localToken && savedAuthToken) {
        console.log("Restoring auth token from sessionStorage");
        localStorage.setItem("token", savedAuthToken);
        localToken = savedAuthToken;
        sessionStorage.removeItem("oauth_auth_token");
      }

      console.log("AuthCallback - Params:", { token: !!token, code: !!code, state });
      console.log("AuthCallback - Auth state:", { storedToken: !!storedToken, isAuthenticated, localToken: !!localToken });

      try {
        if (token) {
          // Auth flow (e.g., Google magic link)
          await verifyAuthToken(token);
          setStatus("success");
          return; // verifyAuthToken handles navigation
        }

        if (code) {
          // Social OAuth (Instagram/LinkedIn/etc.)
          const platform = sessionStorage.getItem("oauth_platform");
          console.log("OAuth Platform from session:", platform);
          
          if (!platform) {
            throw new Error("No platform found in session - please try connecting again from Social Accounts page");
          }

          // Check if user is authenticated (has token in localStorage)
          if (!localToken) {
            console.warn("User not authenticated, storing OAuth code for later");
            sessionStorage.setItem("pending_oauth_code", code);
            sessionStorage.setItem("pending_oauth_platform", platform);
            setStatus("need_auth");
            setTimeout(() => navigate("/login?oauth_pending=true", { replace: true }), 1500);
            return;
          }

          // User is authenticated, try to connect account
          try {
            console.log("Attempting to connect social account...");
            await handleSocialCallback(code, state);
            console.log("Social account connection succeeded!");
            setStatus("success");
            setTimeout(() => navigate("/social-accounts", { replace: true }), 500);
            return;
          } catch (error) {
            console.error("Social account connection failed:", error.message);
            setStatus("error");
            setTimeout(() => navigate("/social-accounts?error=connection_failed", { replace: true }), 2000);
            return;
          }
        }

        throw new Error("No token or code found in URL");
      } catch (error) {
        console.error("Callback error:", error.message);
        setStatus("error");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    };

    handleCallback();
  }, []); // Empty dependency array to run only once

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">
              Completing Authentication...
            </h2>
            <p className="text-gray-600 mt-2">
              Please wait while we verify your credentials
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold">
              Authentication Successful!
            </h2>
            <p className="text-gray-600 mt-2">Redirecting...</p>
          </>
        )}

        {status === "need_auth" && (
          <>
            <div className="text-blue-500 text-5xl mb-4">ℹ️</div>
            <h2 className="text-xl font-semibold">
              Please Log In
            </h2>
            <p className="text-gray-600 mt-2">Redirecting to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h2 className="text-xl font-semibold">Authentication Failed</h2>
            <p className="text-gray-600 mt-2">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
};
