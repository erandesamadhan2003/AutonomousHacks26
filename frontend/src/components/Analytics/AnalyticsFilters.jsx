import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
];

const PLATFORM_OPTIONS = [
  { value: "", label: "All Platforms" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" },
];

export const AnalyticsFilters = ({ filters, onFilterChange, loading }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Period Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Time Period
            </label>
            <div className="flex flex-wrap gap-2">
              {PERIOD_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({ period: option.value })}
                  disabled={loading}
                  className={cn(
                    "transition-all",
                    filters.period === option.value &&
                      "bg-blue-100 border-blue-300 text-blue-700"
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Platform Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Platform
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({ platform: option.value })}
                  disabled={loading}
                  className={cn(
                    "transition-all",
                    filters.platform === option.value &&
                      "bg-indigo-100 border-indigo-300 text-indigo-700"
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
