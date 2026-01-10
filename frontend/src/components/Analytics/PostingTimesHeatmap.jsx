import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const PostingTimesHeatmap = ({ data, loading }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["6AM", "12PM", "6PM"];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          Best Posting Times
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => (
            <div key={idx} className="text-center">
              <p className="text-xs font-medium text-gray-600 mb-2">{day}</p>
              {hours.map((hour, hIdx) => {
                const engagement = Math.random() * 100; // Replace with real data
                return (
                  <div
                    key={hIdx}
                    className="h-8 mb-1 rounded flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: `rgba(79, 70, 229, ${engagement / 100})`,
                      color: engagement > 50 ? "white" : "#6B7280",
                    }}
                  >
                    {Math.round(engagement)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
          <span>Low</span>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: `rgba(79, 70, 229, ${(i + 1) / 10})`,
                }}
              />
            ))}
          </div>
          <span>High</span>
        </div>
      </CardContent>
    </Card>
  );
};
