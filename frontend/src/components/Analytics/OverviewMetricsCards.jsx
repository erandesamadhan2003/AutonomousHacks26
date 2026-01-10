import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Heart,
  MessageCircle,
  Share2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const OverviewMetricsCards = ({ data, loading }) => {
  const metrics = [
    {
      label: "Total Engagement",
      value: data?.totalEngagement || 0,
      icon: Heart,
      color: "text-red-600",
      bg: "bg-red-50",
      change: "+12.5%",
    },
    {
      label: "Total Likes",
      value: data?.totalLikes || 0,
      icon: Heart,
      color: "text-pink-600",
      bg: "bg-pink-50",
      change: "+8.2%",
    },
    {
      label: "Total Comments",
      value: data?.totalComments || 0,
      icon: MessageCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
      change: "+15.3%",
    },
    {
      label: "Total Shares",
      value: data?.totalShares || 0,
      icon: Share2,
      color: "text-green-600",
      bg: "bg-green-50",
      change: "+10.7%",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        const isPositive = metric.change?.startsWith("+");

        return (
          <Card key={idx} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className={cn("p-3 rounded-xl", metric.bg)}>
                  <Icon className={cn("h-6 w-6", metric.color)} />
                </div>
                {metric.change && (
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
                    {metric.change}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
