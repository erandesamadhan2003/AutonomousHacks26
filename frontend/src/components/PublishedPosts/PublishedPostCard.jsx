import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Share2, Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const PLATFORM_EMOJIS = {
  instagram: "📷",
  facebook: "👥",
  twitter: "🐦",
  linkedin: "💼",
};

export const PublishedPostCard = ({ post, onView, onDelete }) => {
  const platformEmoji = PLATFORM_EMOJIS[post.platform] || "📱";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalEngagement =
    (post.metrics?.likes || 0) +
    (post.metrics?.comments || 0) +
    (post.metrics?.shares || 0);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Thumbnail */}
      <div className="relative h-40 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden group">
        {post.images && post.images.length > 0 ? (
          <img
            src={post.images[0]?.url}
            alt={post.caption}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl">{platformEmoji}</div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

        {/* Platform Badge */}
        <div className="absolute top-2 right-2">
          <Badge className="gap-1 bg-white/90 text-gray-900">
            <span className="text-lg">{platformEmoji}</span>
            {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Caption */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {post.caption || "Untitled Post"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(post.publishedAt), {
              addSuffix: true,
            })}
          </p>
        </div>

        {/* Engagement Metrics */}
        <div className="flex gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-red-500" />
            <span className="font-medium">{post.metrics?.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3 text-blue-500" />
            <span className="font-medium">{post.metrics?.comments || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-3 w-3 text-green-500" />
            <span className="font-medium">{post.metrics?.shares || 0}</span>
          </div>
        </div>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.hashtags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {post.hashtags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{post.hashtags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
            className="flex-1 gap-1 text-gray-600 hover:text-gray-900"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="flex-1 gap-1 text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};
