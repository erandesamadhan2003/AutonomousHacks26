import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const Step3AddDescription = ({ description, hashtags, onChange }) => {
  const handleDescriptionChange = (e) => {
    onChange({ ...description, text: e.target.value });
  };

  const handleHashtagChange = (e) => {
    onChange({ ...description, hashtags: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Add Description
        </h2>
        <p className="text-gray-600">
          Write a compelling description and add relevant hashtags
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Caption
            </label>
            <Textarea
              placeholder="Write your post caption here... Add emojis, tags, and make it engaging!"
              value={description.text}
              onChange={handleDescriptionChange}
              className="min-h-32 resize-none"
              maxLength={2200}
            />
            <p className="text-xs text-gray-500 mt-2">
              {description.text.length}/2200 characters
            </p>
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Hashtags
            </label>
            <Input
              placeholder="#marketing #socialmedia #growth (space or comma separated)"
              value={description.hashtags}
              onChange={handleHashtagChange}
            />
            <p className="text-xs text-gray-500 mt-2">
              Add up to 30 hashtags to increase visibility
            </p>
          </div>

          {/* Tips */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Start with a hook to grab attention in the first sentence
              </li>
              <li>• Use line breaks to make your caption easier to read</li>
              <li>• Research trending hashtags for your industry</li>
              <li>• Include a call-to-action at the end</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
