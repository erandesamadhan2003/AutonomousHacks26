import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

const TONE_OPTIONS = [
  "professional",
  "casual",
  "friendly",
  "authoritative",
  "humorous",
];
const STYLE_OPTIONS = [
  "informative",
  "inspirational",
  "educational",
  "entertaining",
  "promotional",
];

export const BrandVoiceTab = ({ preferences, onChange }) => {
  const [keywordInput, setKeywordInput] = useState("");

  const brandVoice = preferences?.brandVoice || {
    tone: "professional",
    style: "informative",
    keywords: [],
  };

  const handleToneChange = (tone) => {
    onChange({
      ...preferences,
      brandVoice: { ...brandVoice, tone },
    });
  };

  const handleStyleChange = (style) => {
    onChange({
      ...preferences,
      brandVoice: { ...brandVoice, style },
    });
  };

  const handleAddKeyword = () => {
    if (
      keywordInput.trim() &&
      !brandVoice.keywords.includes(keywordInput.trim())
    ) {
      onChange({
        ...preferences,
        brandVoice: {
          ...brandVoice,
          keywords: [...brandVoice.keywords, keywordInput.trim()],
        },
      });
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword) => {
    onChange({
      ...preferences,
      brandVoice: {
        ...brandVoice,
        keywords: brandVoice.keywords.filter((k) => k !== keyword),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Brand Voice
        </h2>
        <p className="text-sm text-gray-600">
          Define your brand's personality and communication style for
          AI-generated content
        </p>
      </div>

      {/* Tone Selection */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Tone
        </Label>
        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((tone) => (
            <Badge
              key={tone}
              variant={brandVoice.tone === tone ? "default" : "outline"}
              className={`cursor-pointer capitalize ${
                brandVoice.tone === tone
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleToneChange(tone)}
            >
              {tone}
            </Badge>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Style
        </Label>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((style) => (
            <Badge
              key={style}
              variant={brandVoice.style === style ? "default" : "outline"}
              className={`cursor-pointer capitalize ${
                brandVoice.style === style
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleStyleChange(style)}
            >
              {style}
            </Badge>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Brand Keywords
        </Label>
        <p className="text-xs text-gray-500 mb-3">
          Add keywords that represent your brand to help AI generate relevant
          content
        </p>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Enter a keyword..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
          />
          <button
            onClick={handleAddKeyword}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {brandVoice.keywords.map((keyword, idx) => (
            <Badge key={idx} variant="secondary" className="gap-1 pr-1">
              {keyword}
              <button
                onClick={() => handleRemoveKeyword(keyword)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {brandVoice.keywords.length === 0 && (
            <p className="text-sm text-gray-500">No keywords added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
