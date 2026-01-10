import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export const CaptionSelector = ({
  captions,
  selectedCaption,
  onChange,
  isLoading,
}) => {
  if (!captions || captions.length === 0) {
    return null;
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">
        AI Generated Captions ({captions.length})
      </h3>

      <div className="space-y-3">
        {captions.map((caption, idx) => (
          <Card
            key={idx}
            className={cn(
              "cursor-pointer transition-all duration-300",
              selectedCaption === caption.text
                ? "border-2 border-purple-500 bg-purple-50"
                : "border border-gray-200 hover:border-purple-300"
            )}
            onClick={() => onChange(caption.text)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "shrink-0 mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedCaption === caption.text
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-300 bg-white"
                  )}
                >
                  {selectedCaption === caption.text && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-gray-900 mb-2">{caption.text}</p>
                  {caption.style && (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                      {caption.style}
                    </span>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(caption.text);
                  }}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <p className="text-sm font-medium">
            🤖 AI is generating captions... This may take a moment
          </p>
        </div>
      )}
    </div>
  );
};
