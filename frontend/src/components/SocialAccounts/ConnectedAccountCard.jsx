import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";

const PLATFORM_COLORS = {
  instagram: "from-purple-500 to-pink-500",
  facebook: "from-blue-600 to-blue-400",
  linkedin: "from-blue-700 to-blue-500",
  twitter: "from-sky-500 to-blue-500",
};

const PLATFORM_ICONS = {
  instagram: "📷",
  facebook: "👥",
  linkedin: "💼",
  twitter: "🐦",
};

export const ConnectedAccountCard = ({
  account,
  onDisconnect,
  onRefresh,
  loading,
}) => {
  const gradient =
    PLATFORM_COLORS[account.platform] || "from-gray-500 to-gray-400";
  const icon = PLATFORM_ICONS[account.platform] || "📱";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full bg-linear-to-br flex items-center justify-center text-2xl shrink-0",
                gradient
              )}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate capitalize">
                {account.profile?.username ||
                  account.profile?.name ||
                  account.platform}
              </h3>
              <p className="text-xs text-gray-500 capitalize">
                {account.platform}
              </p>
              <Badge
                className={cn(
                  "mt-1",
                  account.connected
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {account.connected ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          {account.profile?.followers && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">Followers</p>
              <p className="text-lg font-bold text-gray-900">
                {account.profile.followers.toLocaleString()}
              </p>
            </div>
          )}

          {/* Last Synced */}
          <div className="text-xs text-gray-500">
            Last synced:{" "}
            {account.lastSyncedAt
              ? new Date(account.lastSyncedAt).toLocaleDateString()
              : "Never"}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="flex-1 gap-1"
            >
              <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDisconnect}
              disabled={loading}
              className="flex-1 gap-1 text-red-600 hover:text-red-700"
            >
              <Unlink className="h-3 w-3" />
              Disconnect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
