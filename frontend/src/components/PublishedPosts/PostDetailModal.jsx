import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  X,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLATFORM_NAMES = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter",
  linkedin: "LinkedIn",
};

export const PostDetailModal = ({
  isOpen,
  post,
  onClose,
  onDelete,
  loading,
}) => {
  if (!post) return null;

  const totalEngagement =
    (post.metrics?.likes || 0) +
    (post.metrics?.comments || 0) +
    (post.metrics?.shares || 0);

  const engagementRate =
    post.metrics && post.metrics.views
      ? ((totalEngagement / post.metrics.views) * 100).toFixed(2)
      : "0.00";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Post Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {post.images && post.images.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Images ({post.images.length})
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {post.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image.url}
                      alt={`Post image ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Caption */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Caption</h3>
            <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {post.caption || "No caption"}
            </p>
          </div>

          <Separator />

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Metrics */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Performance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <p className="text-xs text-gray-600 font-medium">Likes</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {post.metrics?.likes || 0}
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <p className="text-xs text-gray-600 font-medium">Comments</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {post.metrics?.comments || 0}
                </p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="h-4 w-4 text-green-500" />
                  <p className="text-xs text-gray-600 font-medium">Shares</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {post.metrics?.shares || 0}
                </p>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <p className="text-xs text-gray-600 font-medium">
                    Engagement
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {engagementRate}%
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Platform & Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Platform</p>
              <Badge className="w-fit">{PLATFORM_NAMES[post.platform]}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Post URL</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(post.postUrl, "_blank")}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View on {PLATFORM_NAMES[post.platform]}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-medium">Published</p>
              <p className="text-gray-900">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Last Updated</p>
              <p className="text-gray-900">
                {new Date(
                  post.lastMetricsUpdate || post.publishedAt
                ).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Delete Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={onDelete}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
