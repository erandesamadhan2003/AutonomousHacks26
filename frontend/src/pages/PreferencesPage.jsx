import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { usePreferences } from "@/hooks/usePreferences";
import { cn } from "@/lib/utils";
import { TabNavigation } from "@/components/Preferences/TabNavigation";
import { BrandVoiceTab } from "@/components/Preferences/BrandVoiceTab";
import { PlatformPreferencesTab } from "@/components/Preferences/PlatformPreferencesTab";
import { NotificationsTab } from "@/components/Preferences/NotificationsTab";
import { AISettingsTab } from "@/components/Preferences/AISettingsTab";

const TABS = [
  { id: "brand", label: "Brand Voice", icon: "🎨" },
  { id: "platforms", label: "Platforms", icon: "📱" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "ai", label: "AI Settings", icon: "🤖" },
];

export default function PreferencesPage() {
  const [activeTab, setActiveTab] = useState("brand");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const { preferences, loading, error, update } = usePreferences();

  const [localPreferences, setLocalPreferences] = useState(preferences || {});

  const handleSave = async () => {
    try {
      await update(localPreferences);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving preferences:", err);
    }
  };

  const handleReset = () => {
    setLocalPreferences(preferences || {});
  };

  const hasChanges =
    JSON.stringify(localPreferences) !== JSON.stringify(preferences);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Preferences
            </h1>
            <p className="text-gray-600 mt-1">
              Customize your experience and AI settings
            </p>
          </div>
          {hasChanges && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                size="sm"
                className="bg-linear-to-r from-purple-500 to-pink-500"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        {/* Success Message */}
        {showSaveSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Success!</p>
              <p className="text-sm text-green-700">
                Your preferences have been saved
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <Card className="p-6">
          {loading && !preferences ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
            </div>
          ) : (
            <>
              {activeTab === "brand" && (
                <BrandVoiceTab
                  preferences={localPreferences}
                  onChange={setLocalPreferences}
                />
              )}
              {activeTab === "platforms" && (
                <PlatformPreferencesTab
                  preferences={localPreferences}
                  onChange={setLocalPreferences}
                />
              )}
              {activeTab === "notifications" && (
                <NotificationsTab
                  preferences={localPreferences}
                  onChange={setLocalPreferences}
                />
              )}
              {activeTab === "ai" && (
                <AISettingsTab
                  preferences={localPreferences}
                  onChange={setLocalPreferences}
                />
              )}
            </>
          )}
        </Card>

        {/* Save Button (Bottom) */}
        {hasChanges && (
          <div className="flex justify-end gap-3 pb-8">
            <Button variant="outline" onClick={handleReset}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
