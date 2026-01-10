import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, idx) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center flex-1">
            {/* Step Circle */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300",
                isCompleted
                  ? "bg-green-500 text-white shadow-lg"
                  : isCurrent
                  ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : step}
            </div>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-1 mx-2 rounded-full transition-all duration-300",
                  isCompleted
                    ? "bg-green-500"
                    : isCurrent
                    ? "bg-linear-to-r from-purple-500 to-pink-500"
                    : "bg-gray-300"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
