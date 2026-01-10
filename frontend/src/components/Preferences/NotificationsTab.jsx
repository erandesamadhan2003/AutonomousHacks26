import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const NOTIFICATION_SETTINGS = [
  {
    id: "email",
    label: "Email Notifications",
    description: "Receive updates via email",
  },
  {
    id: "push",
    label: "Push Notifications",
    description: "Browser push notifications",
  },
  {
    id: "postPublished",
    label: "Post Published",
    description: "Notify when a post is published",
  },
  {
    id: "metricsUpdate",
    label: "Metrics Updates",
    description: "Daily analytics summary",
  },
  {
    id: "weeklyReport",
    label: "Weekly Report",
    description: "Comprehensive weekly performance report",
  },
];

export const NotificationsTab = ({ preferences, onChange }) => {
  const notifications = preferences?.notifications || {
    email: true,
    push: true,
    postPublished: true,
    metricsUpdate: false,
    weeklyReport: true,
  };

  const handleToggle = (field) => {
    onChange({
      ...preferences,
      notifications: {
        ...notifications,
        [field]: !notifications[field],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Notifications
        </h2>
        <p className="text-sm text-gray-600">
          Manage how and when you receive notifications
        </p>
      </div>

      <div className="space-y-4">
        {NOTIFICATION_SETTINGS.map((setting, idx) => (
          <div key={setting.id}>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label
                  htmlFor={setting.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {setting.label}
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  {setting.description}
                </p>
              </div>
              <Switch
                id={setting.id}
                checked={notifications[setting.id]}
                onCheckedChange={() => handleToggle(setting.id)}
              />
            </div>
            {idx < NOTIFICATION_SETTINGS.length - 1 && (
              <Separator className="my-2" />
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Keep at least one notification method enabled
          to stay updated on your content performance
        </p>
      </div>
    </div>
  );
};
