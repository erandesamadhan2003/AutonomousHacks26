import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const PlatformConnectCard = ({ platform, isConnected, onConnect }) => {
  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-200",
        isConnected && "border-green-300 bg-green-50"
      )}
    >
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Platform Icon */}
          <div
            className={cn(
              "w-16 h-16 mx-auto rounded-full bg-linear-to-br flex items-center justify-center text-3xl",
              platform.color
            )}
          >
            {platform.icon}
          </div>

          {/* Platform Info */}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {platform.name}
            </h3>
            <p className="text-xs text-gray-600">{platform.description}</p>
          </div>

          {/* Connect Button */}
          {isConnected ? (
            <Button
              disabled
              className="w-full bg-green-600 hover:bg-green-600 cursor-not-allowed gap-2"
            >
              <Check className="h-4 w-4" />
              Connected
            </Button>
          ) : (
            <Button
              onClick={onConnect}
              className={cn(
                "w-full gap-2 bg-linear-to-r text-white",
                platform.color
              )}
            >
              <Plus className="h-4 w-4" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
