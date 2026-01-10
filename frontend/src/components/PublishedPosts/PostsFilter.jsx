import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" },
];

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
];

export const PostsFilter = ({ filters, onFilterChange, loading }) => {
  const hasActiveFilters =
    filters.platform || filters.dateRange || filters.search;

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handlePlatformChange = (platform) => {
    onFilterChange({
      platform: filters.platform === platform ? "" : platform,
    });
  };

  const handleDateRangeChange = (dateRange) => {
    onFilterChange({
      dateRange: filters.dateRange === dateRange ? "" : dateRange,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      platform: "",
      dateRange: "",
      search: "",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            disabled={loading}
            className="pl-10"
          />
        </div>

        {/* Filter Groups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  onClick={() => handlePlatformChange(option.value)}
                  disabled={loading}
                  className={cn(
                    "transition-all",
                    filters.platform === option.value &&
                      "bg-pink-100 border-pink-300 text-pink-700"
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </label>
            <div className="flex flex-wrap gap-2">
              {DATE_RANGE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDateRangeChange(option.value)}
                  disabled={loading}
                  className={cn(
                    "transition-all",
                    filters.dateRange === option.value &&
                      "bg-purple-100 border-purple-300 text-purple-700"
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            disabled={loading}
            className="gap-2 text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </Card>
  );
};
