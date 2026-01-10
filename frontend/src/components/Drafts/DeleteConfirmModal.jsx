// filepath: /home/samadhan/Drive1/Projects/AutonomousHacks26/frontend/src/components/Drafts/DeleteConfirmModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const DeleteConfirmModal = ({
  isOpen,
  draftTitle,
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Draft</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Icon */}
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-900">
              This action cannot be undone. All content will be permanently
              deleted.
            </p>
          </div>

          {/* Draft Title */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Draft to Delete</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {draftTitle || "Untitled Draft"}
            </p>
          </div>

          {/* Confirmation Text */}
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this draft? This will remove all
            associated images and content.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Deleting..." : "Delete Draft"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
