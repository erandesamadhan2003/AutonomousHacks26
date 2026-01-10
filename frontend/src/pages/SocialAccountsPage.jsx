import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, AlertCircle } from "lucide-react";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { useOAuthFlow } from "@/hooks/useOAuthFlow";
import { cn } from "@/lib/utils";
import { PlatformConnectCard } from "@/components/SocialAccounts/PlatformConnectCard";
import { ConnectedAccountCard } from "@/components/SocialAccounts/ConnectedAccountCard";
import { ConnectAccountModal } from "@/components/SocialAccounts/ConnectAccountModal";
import { DisconnectConfirmModal } from "@/components/SocialAccounts/DisconnectConfirmModal";

const AVAILABLE_PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    color: "from-purple-500 to-pink-500",
    description: "Share photos and stories with your audience",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "👥",
    color: "from-blue-600 to-blue-400",
    description: "Connect with friends and family worldwide",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    color: "from-blue-700 to-blue-500",
    description: "Professional networking and career development",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: "🐦",
    color: "from-sky-500 to-blue-500",
    description: "Share your thoughts in real-time",
  },
];

export default function SocialAccountsPage() {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [accountToDisconnect, setAccountToDisconnect] = useState(null);

  const { accounts, loading, error, fetchAccounts, disconnect, refresh } =
    useSocialAccounts();

  const { initiateOAuth, handleCallback } = useOAuthFlow();

  const handleConnect = (platform) => {
    setSelectedPlatform(platform);
    setShowConnectModal(true);
  };

  const handleConfirmConnect = async () => {
    try {
      await initiateOAuth(selectedPlatform.id);
      setShowConnectModal(false);
    } catch (err) {
      console.error("Error connecting account:", err);
    }
  };

  const handleDisconnect = (account) => {
    setAccountToDisconnect(account);
  };

  const handleConfirmDisconnect = async () => {
    try {
      await disconnect(accountToDisconnect._id);
      setAccountToDisconnect(null);
    } catch (err) {
      console.error("Error disconnecting account:", err);
    }
  };

  const handleRefresh = () => {
    fetchAccounts();
  };

  const isConnected = (platformId) => {
    return accounts.some((acc) => acc.platform === platformId && acc.connected);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              Social Accounts
            </h1>
            <p className="text-gray-600 mt-1">
              Connect and manage your social media accounts
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Connected Accounts */}
        {accounts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Connected Accounts ({accounts.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <ConnectedAccountCard
                  key={account._id}
                  account={account}
                  onDisconnect={() => handleDisconnect(account)}
                  onRefresh={() => refresh(account._id)}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Platforms */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {accounts.length > 0
              ? "Add More Platforms"
              : "Connect Your First Account"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {AVAILABLE_PLATFORMS.map((platform) => (
              <PlatformConnectCard
                key={platform.id}
                platform={platform}
                isConnected={isConnected(platform.id)}
                onConnect={() => handleConnect(platform)}
              />
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex gap-4">
            <div className="text-4xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Why Connect Your Accounts?
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Publish content to multiple platforms simultaneously</li>
                <li>• Track engagement and analytics in one place</li>
                <li>• AI-optimized content for each platform</li>
                <li>• Schedule posts across all your accounts</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Connect Modal */}
      <ConnectAccountModal
        isOpen={showConnectModal}
        platform={selectedPlatform}
        onConfirm={handleConfirmConnect}
        onCancel={() => {
          setShowConnectModal(false);
          setSelectedPlatform(null);
        }}
        loading={loading}
      />

      {/* Disconnect Modal */}
      <DisconnectConfirmModal
        isOpen={!!accountToDisconnect}
        account={accountToDisconnect}
        onConfirm={handleConfirmDisconnect}
        onCancel={() => setAccountToDisconnect(null)}
        loading={loading}
      />
    </div>
  );
}
