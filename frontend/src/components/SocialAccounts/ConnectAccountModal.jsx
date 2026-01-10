import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const ConnectAccountModal = ({
  isOpen,
  platform,
  onConfirm,
  onCancel,
  loading,
}) => {
  if (!platform) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full bg-linear-to-br flex items-center justify-center text-2xl",
                platform.color
              )}
            >
              {platform.icon}
            </div>
            Connect {platform.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-600">{platform.description}</p>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">What We'll Access:</p>
              <ul className="text-xs space-y-1">
                <li>• Basic profile information</li>
                <li>• Post and publish content</li>
                <li>• View engagement metrics</li>
                <li>• Manage your posts</li>
              </ul>
            </div>
          </div>

          {/* Permissions Notice */}
          <p className="text-xs text-gray-500">
            You'll be redirected to {platform.name} to authorize this
            connection. We follow industry-standard security practices to
            protect your data.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className={cn(
                "flex-1 gap-2 bg-linear-to-r text-white",
                platform.color
              )}
            >
              {loading ? "Connecting..." : "Continue"}
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
