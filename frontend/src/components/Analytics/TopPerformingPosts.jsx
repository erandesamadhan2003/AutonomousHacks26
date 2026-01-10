import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export const TopPerformingPosts = ({ posts, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded" />
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
          <Trophy className="h-5 w-5 text-yellow-600" />
          Top Performing Posts
        </h3>
        <div className="space-y-3">
          {posts && posts.length > 0 ? (
            posts.slice(0, 5).map((post, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="shrink-0 w-12 h-12 bg-linear-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center font-bold text-purple-600">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {post.title || post.caption || "Untitled"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {post.platform} • {post.totalEngagement || 0} engagements
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              No posts available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
