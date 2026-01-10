import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const AGENTS = [
  { id: "caption", label: "Caption Generation", icon: "✍️" },
  { id: "image", label: "Image Enhancement", icon: "🖼️" },
  { id: "video", label: "Video Creation", icon: "🎬" },
  { id: "music", label: "Music Suggestions", icon: "🎵" },
];

export const ProcessingStatus = ({ agentStatuses }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5" />;
      case "processing":
        return <Loader className="h-5 w-5 animate-spin" />;
      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
        );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Processing Status</h3>

      <div className="space-y-2">
        {AGENTS.map((agent) => {
          const status = agentStatuses?.[agent.id] || "pending";

          return (
            <Card key={agent.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{agent.icon}</div>

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{agent.label}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                        getStatusColor(status)
                      )}
                    >
                      {status === "pending" ? "Waiting" : status}
                    </div>
                    <div>{getStatusIcon(status)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
