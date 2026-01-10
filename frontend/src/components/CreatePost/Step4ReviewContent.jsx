import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CaptionSelector } from "./CaptionSelector";
import { HashtagSelector } from "./HashtagSelector";
import { MusicSelector } from "./MusicSelector";

export const Step4ReviewContent = ({
  images,
  aiContent,
  selectedCaption,
  selectedHashtags,
  selectedMusic,
  onCaptionChange,
  onHashtagChange,
  onMusicChange,
  isProcessing,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Customize
        </h2>
        <p className="text-gray-600">
          Select your preferred AI-generated content or customize
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Preview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
              {images && images.length > 0 && (
                <div className="space-y-3">
                  <img
                    src={images[0].preview}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                  <p className="text-xs text-gray-600">
                    {images.length} image{images.length > 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Content Selectors */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Captions */}
              <div>
                <CaptionSelector
                  captions={aiContent?.captions || []}
                  selectedCaption={selectedCaption}
                  onChange={onCaptionChange}
                  isLoading={isProcessing}
                />
              </div>

              <Separator />

              {/* Hashtags */}
              <div>
                <HashtagSelector
                  hashtags={aiContent?.hashtags || []}
                  selectedHashtags={selectedHashtags}
                  onChange={onHashtagChange}
                />
              </div>

              <Separator />

              {/* Music */}
              <div>
                <MusicSelector
                  suggestions={aiContent?.musicSuggestions || []}
                  selectedMusic={selectedMusic}
                  onChange={onMusicChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isProcessing && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <p className="text-sm font-medium">
            🤖 AI is processing your content... Please wait
          </p>
        </div>
      )}
    </div>
  );
};
