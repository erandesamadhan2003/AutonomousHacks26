import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const EngagementLineChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Engagement Trend
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxEngagement = Math.max(...data.map((d) => d.engagement || 0));

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Engagement Trend
        </h3>
        <div className="space-y-3">
          {data.slice(0, 7).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-20">{item.date}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden relative">
                <div
                  className="bg-linear-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                  style={{
                    width: `${(item.engagement / maxEngagement) * 100}%`,
                  }}
                >
                  <span className="text-xs font-medium text-white">
                    {item.engagement}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
