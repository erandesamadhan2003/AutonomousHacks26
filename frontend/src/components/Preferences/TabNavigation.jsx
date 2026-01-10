import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "outline"}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "gap-2 whitespace-nowrap transition-all",
            activeTab === tab.id
              ? "bg-linear-to-r from-purple-500 to-pink-500 text-white"
              : "hover:bg-gray-50"
          )}
        >
          <span className="text-lg">{tab.icon}</span>
          {tab.label}
        </Button>
      ))}
    </div>
  );
};
