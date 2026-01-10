import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const HashtagSelector = ({ hashtags, selectedHashtags, onChange }) => {
  if (!hashtags || hashtags.length === 0) {
    return null;
  }

  const toggleHashtag = (hashtag) => {
    if (selectedHashtags.includes(hashtag)) {
      onChange(selectedHashtags.filter((h) => h !== hashtag));
    } else {
      onChange([...selectedHashtags, hashtag]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">
        Trending Hashtags ({hashtags.length})
      </h3>

      <div className="flex flex-wrap gap-2">
        {hashtags.map((hashtag) => {
          const isSelected = selectedHashtags.includes(hashtag);

          return (
            <Button
              key={hashtag}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => toggleHashtag(hashtag)}
              className={cn(
                "rounded-full",
                isSelected &&
                  "bg-linear-to-r from-purple-500 to-pink-500 border-0 text-white"
              )}
            >
              {hashtag}
              {isSelected && <X className="h-3 w-3 ml-1" />}
            </Button>
          );
        })}
      </div>

      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">
          Selected: {selectedHashtags.length} hashtags
        </p>
      </div>
    </div>
  );
};
