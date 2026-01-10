// filepath: /home/samadhan/Drive1/Projects/AutonomousHacks26/frontend/src/components/Drafts/DraftDetailModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_COLORS = {
  draft: { bg: "bg-gray-100", text: "text-gray-700" },
  processing: { bg: "bg-blue-100", text: "text-blue-700" },
  ready: { bg: "bg-green-100", text: "text-green-700" },
};

const PLATFORM_NAMES = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter",
  linkedin: "LinkedIn",
};

export const DraftDetailModal = ({
  isOpen,
  draft,
  onClose,
  onEdit,
  onPublish,
  onDelete,
  loading,
}) => {
  if (!draft) return null;

  const statusColor = STATUS_COLORS[draft.status] || STATUS_COLORS.draft;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Draft Details
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
          {/* Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <Badge className={cn(statusColor.bg, statusColor.text)}>
              {draft.status.charAt(0).toUpperCase() + draft.status.slice(1)}
            </Badge>
          </div>

          <Separator />

          {/* Images */}
          {draft.originalImages && draft.originalImages.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Images ({draft.originalImages.length})
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {draft.originalImages.map((image, idx) => (
                    <img
                      key={idx}
                      src={image.url}
                      alt={`Draft image ${idx + 1}`}
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
              {draft.selectedCaption || draft.originalCaption || "No caption"}
            </p>
          </div>

          <Separator />

          {/* Hashtags */}
          {draft.hashtags && draft.hashtags.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {draft.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Platforms */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Publishing Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {draft.platforms?.map((platform) => (
                <Badge key={platform} variant="outline">
                  {PLATFORM_NAMES[platform] || platform}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* AI Generated Content */}
          {draft.aiGeneratedCaptions &&
            draft.aiGeneratedCaptions.length > 0 && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    AI Generated Captions
                  </h3>
                  <div className="space-y-2">
                    {draft.aiGeneratedCaptions.map((caption, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-purple-50 rounded-lg border border-purple-200"
                      >
                        <p className="text-sm text-gray-900">{caption.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Platform: {caption.platform}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Created</p>
              <p className="font-medium text-gray-900">
                {new Date(draft.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Updated</p>
              <p className="font-medium text-gray-900">
                {new Date(draft.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onEdit}
              disabled={loading}
              className="flex-1 gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              disabled={loading}
              className="flex-1 gap-2 text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            {draft.status === "ready" && (
              <Button
                onClick={onPublish}
                disabled={loading}
                className="flex-1 gap-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Send className="h-4 w-4" />
                Publish
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
