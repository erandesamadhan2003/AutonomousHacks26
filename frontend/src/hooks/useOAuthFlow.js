import { useState } from "react";
import { connectAccount } from "@/services/social.service";

const OAUTH_CONFIG = {
    instagram: {
        clientId: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
        redirectUri: `${window.location.origin}/auth/callback`,
        scope: "user_profile,user_media",
        authUrl: "https://api.instagram.com/oauth/authorize",
    },
    facebook: {
        clientId: import.meta.env.VITE_FACEBOOK_APP_ID,
        redirectUri: `${window.location.origin}/auth/callback`,
        scope: "pages_show_list,pages_read_engagement,pages_manage_posts",
        authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    },
    linkedin: {
        clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
        redirectUri: `${window.location.origin}/auth/callback`,
        scope: "r_liteprofile,w_member_social",
        authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    },
    twitter: {
        clientId: import.meta.env.VITE_TWITTER_CLIENT_ID,
        redirectUri: `${window.location.origin}/auth/callback`,
        scope: "tweet.read,tweet.write,users.read",
        authUrl: "https://twitter.com/i/oauth2/authorize",
    },
};

export const useOAuthFlow = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initiateOAuth = async (platform) => {
        try {
            setLoading(true);
            setError(null);

            const config = OAUTH_CONFIG[platform];
            if (!config) {
                throw new Error(`Platform ${platform} is not supported`);
            }

            // Store platform in session storage for callback
            sessionStorage.setItem("oauth_platform", platform);

            // Build OAuth URL
            const params = new URLSearchParams({
                client_id: config.clientId,
                redirect_uri: config.redirectUri,
                scope: config.scope,
                response_type: "code",
                state: Math.random().toString(36).substring(7),
            });

            // Redirect to OAuth provider
            window.location.href = `${config.authUrl}?${params.toString()}`;
        } catch (err) {
            console.error("OAuth initiation error:", err);
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    const handleCallback = async (code, state) => {
        try {
            setLoading(true);
            setError(null);

            const platform = sessionStorage.getItem("oauth_platform");
            if (!platform) {
                throw new Error("No platform found in session");
            }

            const config = OAUTH_CONFIG[platform];
            const result = await connectAccount(platform, code, config.redirectUri);

            // Clear session storage
            sessionStorage.removeItem("oauth_platform");

            setLoading(false);
            return result;
        } catch (err) {
            console.error("OAuth callback error:", err);
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    return {
        initiateOAuth,
        handleCallback,
        loading,
        error,
    };
};
