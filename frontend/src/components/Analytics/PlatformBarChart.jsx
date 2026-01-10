import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const PlatformBarChart = ({ data, loading }) => {
  const platforms = [
    { name: "Instagram", count: data?.instagram || 0, color: "bg-purple-500" },
    { name: "Facebook", count: data?.facebook || 0, color: "bg-blue-500" },
    { name: "LinkedIn", count: data?.linkedin || 0, color: "bg-blue-700" },
    { name: "Twitter", count: data?.twitter || 0, color: "bg-sky-500" },
  ];

  const maxCount = Math.max(...platforms.map((p) => p.count));

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

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          Posts by Platform
        </h3>
        <div className="space-y-4">
          {platforms.map((platform, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {platform.name}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {platform.count}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`${platform.color} h-3 rounded-full transition-all duration-500`}
                  style={{
                    width: `${
                      maxCount > 0 ? (platform.count / maxCount) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
