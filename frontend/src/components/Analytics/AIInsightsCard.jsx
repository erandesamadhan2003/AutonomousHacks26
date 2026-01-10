import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

export const AIInsightsCard = ({ insights, loading }) => {
  if (loading) {
    return (
      <Card className="bg-linear-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-linear-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-purple-600" />
          AI-Powered Insights
        </h3>
        <div className="space-y-3">
          {insights && insights.length > 0 ? (
            insights.map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm"
              >
                {insight.type === "success" ? (
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {insight.message}
                  </p>
                  {insight.platform && (
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      Platform: {insight.platform}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                Insights will appear here as you post more content
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
