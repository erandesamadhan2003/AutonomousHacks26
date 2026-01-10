import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    description: "Photos, Reels, Stories",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "👥",
    description: "Posts, Images, Videos",
    color: "from-blue-600 to-blue-400",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    description: "Professional Content",
    color: "from-blue-700 to-blue-500",
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: "🐦",
    description: "Tweets, Images",
    color: "from-sky-500 to-blue-500",
  },
];

export const Step1SelectPlatform = ({ selectedPlatforms, onChange }) => {
  const togglePlatform = (platformId) => {
    if (selectedPlatforms.includes(platformId)) {
      onChange(selectedPlatforms.filter((p) => p !== platformId));
    } else {
      onChange([...selectedPlatforms, platformId]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Platforms
        </h2>
        <p className="text-gray-600">
          Choose where you want to publish this content
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);

          return (
            <Card
              key={platform.id}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-lg",
                isSelected
                  ? "border-2 border-purple-500 shadow-lg"
                  : "border border-gray-200 hover:border-purple-300"
              )}
              onClick={() => togglePlatform(platform.id)}
            >
              <CardContent className="p-6">
                <div className="relative">
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                      <Check className="h-4 w-4" />
                    </div>
                  )}

                  <div className="text-5xl mb-3">{platform.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {platform.description}
                  </p>

                  {isSelected && (
                    <div
                      className={cn(
                        "mt-4 h-1 rounded-full bg-linear-to-r",
                        platform.color
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPlatforms.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <p className="text-sm font-medium">
            Please select at least one platform to continue
          </p>
        </div>
      )}
    </div>
  );
};
