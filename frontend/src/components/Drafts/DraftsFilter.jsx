import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export const DraftsFilter = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "processing", label: "Processing" },
    { value: "ready", label: "Ready" },
    { value: "published", label: "Published" },
  ];

  const platformOptions = [
    { value: "all", label: "All Platforms" },
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter" },
  ];

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (status) => {
    onFilterChange({ status });
  };

  const handlePlatformChange = (platform) => {
    onFilterChange({ platform });
  };

  const handleClearFilters = () => {
    onFilterChange({
      status: "all",
      platform: "all",
      search: "",
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.platform !== "all" ||
    filters.search !== "";

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search by caption or hashtags..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(option.value)}
                  className={cn(
                    "transition-all",
                    filters.status === option.value &&
                      "bg-indigo-100 border-indigo-300 text-indigo-700"
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Platform Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlatformChange(option.value)}
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

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="gap-2 text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
