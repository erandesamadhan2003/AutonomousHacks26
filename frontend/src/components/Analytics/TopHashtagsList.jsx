import { Card, CardContent } from "@/components/ui/card";
import { Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TopHashtagsList = ({ hashtags, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Hash className="h-5 w-5 text-blue-600" />
          Top Hashtags
        </h3>
        <div className="space-y-3">
          {hashtags && hashtags.length > 0 ? (
            hashtags.slice(0, 10).map((hashtag, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">#{hashtag.tag}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {hashtag.avgEngagement}
                  </p>
                  <p className="text-xs text-gray-500">{hashtag.count} posts</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No hashtags data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
