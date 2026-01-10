import { Card, CardContent } from "@/components/ui/card";
import { PieChart } from "lucide-react";

export const PostTypePieChart = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-48 bg-gray-200 rounded-full mx-auto w-48" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PieChart className="h-5 w-5 text-green-600" />
          Content Types
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <span className="text-sm font-medium">Images</span>
            <span className="text-lg font-bold text-purple-600">
              {data?.imagesPosts || 0}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium">Videos</span>
            <span className="text-lg font-bold text-blue-600">
              {data?.videoPosts || 0}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium">Carousel</span>
            <span className="text-lg font-bold text-green-600">
              {data?.carouselPosts || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
