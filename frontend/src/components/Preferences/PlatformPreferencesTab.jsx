import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "👥",
    color: "bg-gradient-to-r from-blue-600 to-blue-400",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "💼",
    color: "bg-gradient-to-r from-blue-700 to-blue-500",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: "🐦",
    color: "bg-gradient-to-r from-sky-500 to-blue-500",
  },
];

export const PlatformPreferencesTab = ({ preferences, onChange }) => {
  const platformPreferences = preferences?.platformPreferences || {};

  const handlePlatformToggle = (platformId, field) => {
    onChange({
      ...preferences,
      platformPreferences: {
        ...platformPreferences,
        [platformId]: {
          ...platformPreferences[platformId],
          [field]: !platformPreferences[platformId]?.[field],
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Platform Preferences
        </h2>
        <p className="text-sm text-gray-600">
          Configure settings for each social media platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLATFORMS.map((platform) => {
          const prefs = platformPreferences[platform.id] || {
            enabled: true,
            autoPost: false,
          };

          return (
            <Card key={platform.id} className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center text-2xl`}
                >
                  {platform.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {platform.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Configure platform settings
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Enabled Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <Label
                    htmlFor={`${platform.id}-enabled`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    Enable Platform
                  </Label>
                  <Switch
                    id={`${platform.id}-enabled`}
                    checked={prefs.enabled}
                    onCheckedChange={() =>
                      handlePlatformToggle(platform.id, "enabled")
                    }
                  />
                </div>

                {/* Auto Post Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label
                      htmlFor={`${platform.id}-auto`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      Auto-Post
                    </Label>
                    <p className="text-xs text-gray-500">
                      Automatically publish drafts
                    </p>
                  </div>
                  <Switch
                    id={`${platform.id}-auto`}
                    checked={prefs.autoPost}
                    onCheckedChange={() =>
                      handlePlatformToggle(platform.id, "autoPost")
                    }
                    disabled={!prefs.enabled}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
