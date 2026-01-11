import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Trash2, Calendar, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

export const DraftCard = ({
  draft,
  onSelect,
  onDelete,
  getStatusColor,
  getStatusBg,
}) => {
  // Show video thumbnail if available, otherwise show image
  const thumbnail =
    draft.aiGeneratedVideo?.url ||
    draft.originalImages?.[0]?.url ||
    draft.aiGeneratedImages?.[0]?.variants?.[0]?.url;

  const hasVideo = !!draft.aiGeneratedVideo;
  const hasAiContent =
    draft.aiGeneratedCaptions?.length > 0 ||
    draft.aiGeneratedImages?.length > 0 ||
    hasVideo ||
    draft.musicSuggestions?.length > 0;

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <Zap className="h-4 w-4 animate-pulse" />;
      case "ready":
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer">
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="relative w-full h-32 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
          {thumbnail ? (
            <>
              {hasVideo && draft.aiGeneratedVideo.url.includes("base64") ? (
                <img
                  src={draft.aiGeneratedVideo.url}
                  alt="Generated video"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : thumbnail.includes("base64") ? (
                <img
                  src={thumbnail}
                  alt={draft.originalCaption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <img
                  src={thumbnail}
                  alt={draft.originalCaption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* Video indicator */}
              {hasVideo && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded-full text-white text-xs font-medium flex items-center gap-1">
                  🎬 Video
                </div>
              )}

              {/* AI badge */}
              {hasAiContent && (
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-purple-500/90 rounded-full text-white text-xs font-medium flex items-center gap-1">
                  ✨ AI Enhanced
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-3xl">📸</div>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              size="sm"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>

          {/* Status Badge */}
          <div
            className={cn(
              "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm",
              getStatusBg(draft.status),
              getStatusColor(draft.status)
            )}
          >
            {getStatusIcon(draft.status)}
            <span className="capitalize">{draft.status}</span>
          </div>

          {/* Platforms */}
          {draft.platforms?.length > 0 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {draft.platforms.map((platform) => (
                <span
                  key={platform}
                  className="text-xs font-medium px-2 py-1 bg-white/90 rounded-full shadow-sm"
                >
                  {platform === "instagram" && "📷"}
                  {platform === "facebook" && "👥"}
                  {platform === "linkedin" && "💼"}
                  {platform === "twitter" && "🐦"}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Caption */}
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {draft.selectedCaption || draft.originalCaption || "Untitled"}
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(draft.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {draft.scheduledFor && (
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                <span>
                  Scheduled for{" "}
                  {new Date(draft.scheduledFor).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Hashtags */}
          {draft.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {draft.hashtags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded"
                >
                  #{tag}
                </span>
              ))}
              {draft.hashtags.length > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  +{draft.hashtags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="flex-1 text-indigo-600 hover:text-indigo-700"
            >
              Edit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSelect()}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete()}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
