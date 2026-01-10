import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export const AISettingsTab = ({ preferences, onChange }) => {
  const aiSettings = preferences?.aiSettings || {
    captionVariations: 3,
    imageEnhancements: true,
    videoGeneration: true,
    musicSuggestions: true,
  };

  const handleToggle = (field) => {
    onChange({
      ...preferences,
      aiSettings: {
        ...aiSettings,
        [field]: !aiSettings[field],
      },
    });
  };

  const handleSliderChange = (value) => {
    onChange({
      ...preferences,
      aiSettings: {
        ...aiSettings,
        captionVariations: value[0],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          AI Settings
        </h2>
        <p className="text-sm text-gray-600">
          Configure AI-powered features and content generation
        </p>
      </div>

      {/* Caption Variations */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Caption Variations
        </Label>
        <p className="text-xs text-gray-500">
          Number of AI-generated caption options: {aiSettings.captionVariations}
        </p>
        <Slider
          value={[aiSettings.captionVariations]}
          onValueChange={handleSliderChange}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1</span>
          <span>5</span>
        </div>
      </div>

      <Separator />

      {/* Feature Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Label
              htmlFor="imageEnhancements"
              className="text-sm font-medium cursor-pointer"
            >
              Image Enhancements
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              AI-powered image optimization and filtering
            </p>
          </div>
          <Switch
            id="imageEnhancements"
            checked={aiSettings.imageEnhancements}
            onCheckedChange={() => handleToggle("imageEnhancements")}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Label
              htmlFor="videoGeneration"
              className="text-sm font-medium cursor-pointer"
            >
              Video Generation
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Generate videos from images automatically
            </p>
          </div>
          <Switch
            id="videoGeneration"
            checked={aiSettings.videoGeneration}
            onCheckedChange={() => handleToggle("videoGeneration")}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Label
              htmlFor="musicSuggestions"
              className="text-sm font-medium cursor-pointer"
            >
              Music Suggestions
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Get AI-recommended background music for videos
            </p>
          </div>
          <Switch
            id="musicSuggestions"
            checked={aiSettings.musicSuggestions}
            onCheckedChange={() => handleToggle("musicSuggestions")}
          />
        </div>
      </div>

      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm text-purple-900">
          🤖 <strong>AI Features:</strong> These settings control AI agent
          behaviors. More features unlock with higher plans.
        </p>
      </div>
    </div>
  );
};
