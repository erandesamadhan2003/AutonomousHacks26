import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Heart,
  Users,
  TrendingUp,
  Camera,
  BarChart3,
  Link2,
  RefreshCw,
  Calendar,
  Clock,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  StatCard,
  ActivityItem,
  QuickActionCard,
  AccountCard,
  LoadingSkeleton,
  QuickStatsCard,
  TopPostCard,
  EngagementChart,
} from "@/components/DashboardComponent";

export default function DashboardPage() {
  const { data, loading, error, period, refresh } = useDashboard();
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      icon: FileText,
      label: "Total Posts",
      value: data?.overview?.stats?.totalPosts ?? 0,
      change: data?.overview?.stats?.changes?.posts ?? 0,
    },
    {
      icon: Heart,
      label: "Total Engagement",
      value: data?.overview?.stats?.totalEngagement ?? 0,
      change: data?.overview?.stats?.changes?.engagement ?? 0,
    },
    {
      icon: Users,
      label: "Connected Accounts",
      value: data?.overview?.stats?.connectedAccounts ?? 0,
      change: data?.overview?.stats?.changes?.accounts ?? 0,
    },
    {
      icon: TrendingUp,
      label: "Avg Engagement Rate",
      value: `${data?.overview?.stats?.avgEngagementRate ?? 0}%`,
      change: data?.overview?.stats?.changes?.avgRate ?? 0,
    },
  ];

  const handlePeriodChange = (newPeriod) => {
    refresh(newPeriod);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.fullName || "User"}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your social media
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              disabled={loading}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <Button
              variant="outline"
              onClick={() => refresh(period)}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="p-6 text-rose-700">
              <p className="font-medium">⚠️ {error}</p>
              <Button
                variant="outline"
                onClick={() => refresh(period)}
                className="mt-4"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, idx) => (
              <StatCard
                key={idx}
                icon={s.icon}
                label={s.label}
                value={s.value}
                change={s.change}
              />
            ))}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    Recent Activity
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refresh(period)}
                    disabled={loading}
                  >
                    Reload
                  </Button>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-2">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 rounded-lg bg-gray-100 animate-pulse"
                      />
                    ))
                  ) : data?.recentActivities?.length > 0 ? (
                    data.recentActivities
                      .slice(0, 5)
                      .map((activity, i) => (
                        <ActivityItem
                          key={i}
                          title={activity.title}
                          desc={activity.description}
                          time={activity.time}
                          type={activity.type}
                        />
                      ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium">
                        No recent activity found
                      </p>
                      <p className="text-xs mt-1">
                        Start creating posts to see activity here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Posts */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  Top Performing Posts
                </h2>
                <Separator className="mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-24 rounded-lg bg-gray-100 animate-pulse"
                      />
                    ))
                  ) : data?.topPosts?.length > 0 ? (
                    data.topPosts.map((post, i) => (
                      <TopPostCard key={i} post={post} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium">No posts yet</p>
                      <p className="text-xs mt-1">
                        Create your first post to see performance
                      </p>
                      <Button
                        onClick={() => navigate("/create-post")}
                        className="mt-4"
                        size="sm"
                      >
                        Create Post
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Chart */}
            {data?.engagementChart && data.engagementChart.length > 0 && (
              <EngagementChart data={data.engagementChart} />
            )}
          </div>

          {/* Right Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Quick Stats */}
            {!loading && data?.quickStats && (
              <QuickStatsCard
                postsThisWeek={data.quickStats.postsThisWeek ?? 0}
                draftsPending={data.quickStats.draftsPending ?? 0}
                scheduledPosts={data.quickStats.scheduledPosts ?? 0}
                processingPosts={data.quickStats.processingPosts ?? 0}
              />
            )}

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <Separator className="mb-4" />
                <div className="space-y-3">
                  <QuickActionCard
                    title="Create New Post"
                    description="Start crafting content"
                    icon={Camera}
                    onClick={() => navigate("/create-post")}
                    gradient="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500"
                  />
                  <QuickActionCard
                    title="View Analytics"
                    description="Check performance"
                    icon={BarChart3}
                    onClick={() => navigate("/analytics")}
                    gradient="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
                  />
                  <QuickActionCard
                    title="Connect Account"
                    description="Add social accounts"
                    icon={Link2}
                    onClick={() => navigate("/social-accounts")}
                    gradient="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Connected Accounts */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Link2 className="h-5 w-5 text-indigo-600" />
              Connected Accounts
            </h2>
            <Separator className="mb-4" />
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-lg bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : data?.connectedAccounts?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.connectedAccounts.map((acc, i) => (
                  <AccountCard
                    key={i}
                    name={acc.name}
                    connected={acc.connected}
                    platform={acc.platform}
                    followers={acc.followers}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium mb-1">
                  No connected accounts yet
                </p>
                <p className="text-xs mb-4">
                  Connect your social media accounts to get started
                </p>
                <Button onClick={() => navigate("/social-accounts")}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect Your First Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
