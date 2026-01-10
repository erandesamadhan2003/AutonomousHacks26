import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";
import { AnalyticsFilters } from "@/components/Analytics/AnalyticsFilters";
import { OverviewMetricsCards } from "@/components/Analytics/OverviewMetricsCards";
import { EngagementLineChart } from "@/components/Analytics/EngagementLineChart";
import { PlatformBarChart } from "@/components/Analytics/PlatformBarChart";
import { PostTypePieChart } from "@/components/Analytics/PostTypePieChart";
import { PostingTimesHeatmap } from "@/components/Analytics/PostingTimesHeatmap";
import { TopPerformingPosts } from "@/components/Analytics/TopPerformingPosts";
import { TopHashtagsList } from "@/components/Analytics/TopHashtagsList";
import { AIInsightsCard } from "@/components/Analytics/AIInsightsCard";

export default function AnalyticsPage() {
  const [filters, setFilters] = useState({
    period: "30d",
    platform: "",
  });

  const {
    data,
    loading,
    error,
    setFilters: setAnalyticsFilters,
    fetchAll,
  } = useAnalytics(filters);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setAnalyticsFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleRefresh = () => {
    fetchAll();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Track your performance across all platforms
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

        {/* Filters */}
        <AnalyticsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* Error Display */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-red-700 text-sm">{error}</p>
          </Card>
        )}

        {/* Overview Metrics */}
        <OverviewMetricsCards data={data.overview} loading={loading} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EngagementLineChart data={data.engagementTrend} loading={loading} />
          <PlatformBarChart data={data.overview} loading={loading} />
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PostTypePieChart data={data.overview} loading={loading} />
          <div className="lg:col-span-2">
            <PostingTimesHeatmap data={data.bestTimes} loading={loading} />
          </div>
        </div>

        {/* Top Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPerformingPosts posts={data.topPosts} loading={loading} />
          <TopHashtagsList hashtags={data.hashtags} loading={loading} />
        </div>

        {/* AI Insights */}
        <AIInsightsCard insights={data.insights} loading={loading} />
      </div>
    </div>
  );
}
