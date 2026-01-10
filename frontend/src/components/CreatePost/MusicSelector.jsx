import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const MusicSelector = ({ suggestions, selectedMusic, onChange }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">
        Music Suggestions ({suggestions.length})
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((music) => (
          <Card
            key={music.id}
            className={cn(
              "cursor-pointer transition-all duration-300",
              selectedMusic?.id === music.id
                ? "border-2 border-purple-500 bg-purple-50"
                : "border border-gray-200 hover:border-purple-300"
            )}
            onClick={() => onChange(music)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Music Icon */}
                <div
                  className={cn(
                    "shrink-0 h-10 w-10 rounded-lg flex items-center justify-center",
                    selectedMusic?.id === music.id
                      ? "bg-purple-500"
                      : "bg-gray-100"
                  )}
                >
                  <span className="text-lg">🎵</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {music.title}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {music.artist}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {music.duration}s • {music.mood}
                  </p>
                </div>

                {selectedMusic?.id === music.id && (
                  <div className="shrink-0 text-purple-600">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
