import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";

// Stat Card Component
export const StatCard = ({ icon: Icon, label, value, change }) => {
  const isPositive = change >= 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
          {change !== 0 && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Activity Item Component
export const ActivityItem = ({ title, desc, time, type = "info" }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="shrink-0 mt-1">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-600 mt-1">{desc}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
    </div>
  );
};

// Quick Action Card Component
export const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  gradient,
}) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 overflow-hidden group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-xl text-white", gradient)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Account Card Component
export const AccountCard = ({ name, connected, platform, followers }) => {
  const platformColors = {
    instagram: "from-purple-500 to-pink-500",
    facebook: "from-blue-600 to-blue-400",
    twitter: "from-sky-500 to-blue-500",
    linkedin: "from-blue-700 to-blue-500",
    youtube: "from-red-500 to-red-600",
    tiktok: "from-black to-gray-800",
    default: "from-gray-500 to-gray-400",
  };

  const gradient =
    platformColors[platform?.toLowerCase()] || platformColors.default;

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        connected ? "hover:shadow-md border-green-200" : "opacity-60"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-full bg-linear-to-br flex items-center justify-center text-white font-bold text-lg",
              gradient
            )}
          >
            {name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <p
              className={cn(
                "text-xs font-medium",
                connected ? "text-green-600" : "text-gray-500"
              )}
            >
              {connected ? "Connected" : "Not Connected"}
            </p>
            {followers && (
              <p className="text-xs text-gray-500 mt-1">
                {followers.toLocaleString()} followers
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Quick Stats Component
export const QuickStatsCard = ({
  postsThisWeek,
  draftsPending,
  scheduledPosts,
  processingPosts,
}) => {
  const statsData = [
    {
      label: "Posts This Week",
      value: postsThisWeek,
      icon: "📝",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Drafts",
      value: draftsPending,
      icon: "✏️",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Scheduled",
      value: scheduledPosts,
      icon: "📅",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Processing",
      value: processingPosts,
      icon: "⚙️",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {statsData.map((stat, idx) => (
            <div key={idx} className={cn("p-3 rounded-lg", stat.bg)}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{stat.icon}</span>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
              <p className={cn("text-2xl font-bold", stat.color)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton Component
export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="w-16 h-4 bg-gray-200 rounded" />
              </div>
              <div className="space-y-2">
                <div className="w-24 h-3 bg-gray-200 rounded" />
                <div className="w-16 h-6 bg-gray-200 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Top Posts Component
export const TopPostCard = ({ post }) => {
  const platformEmojis = {
    instagram: "📷",
    facebook: "👥",
    twitter: "🐦",
    linkedin: "💼",
    youtube: "📺",
    tiktok: "🎵",
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl">
              {platformEmojis[post.platform?.toLowerCase()] || "📱"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate mb-1">
              {post.title || post.caption || "Untitled Post"}
            </h4>
            <p className="text-xs text-gray-600 mb-2 capitalize">
              {post.platform || "Unknown"}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>❤️ {post.likes || 0}</span>
              <span>💬 {post.comments || 0}</span>
              <span>📤 {post.shares || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Engagement Chart Component
export const EngagementChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Engagement Trend
          </h3>
          <div className="flex items-center justify-center h-48 text-gray-500">
            <div className="text-center">
              <p className="text-sm">No engagement data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxEngagement = Math.max(...data.map((item) => item.engagement || 0));

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Engagement Trend
        </h3>
        <div className="space-y-3">
          {data.slice(0, 7).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-16">
                {item.date || `Day ${idx + 1}`}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      maxEngagement > 0
                        ? (item.engagement / maxEngagement) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-12 text-right">
                {item.engagement || 0}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
