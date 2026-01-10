import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const DisconnectConfirmModal = ({
  isOpen,
  account,
  onConfirm,
  onCancel,
  loading,
}) => {
  if (!account) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Disconnect Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-900">
              This action will disconnect your account and you won't be able to
              publish to it.
            </p>
          </div>

          {/* Account Info */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Account to Disconnect</p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {account.profile?.username ||
                account.profile?.name ||
                account.platform}
            </p>
            <p className="text-xs text-gray-500 mt-1 capitalize">
              {account.platform}
            </p>
          </div>

          {/* Confirmation Text */}
          <p className="text-sm text-gray-600">
            You can reconnect this account later by going through the connection
            process again.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
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
              {loading ? "Disconnecting..." : "Disconnect"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
