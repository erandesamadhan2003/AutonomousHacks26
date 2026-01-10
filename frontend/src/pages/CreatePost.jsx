import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useCreateContent } from "@/hooks/useCreateContent";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { usePolling } from "@/hooks/usePolling";
import { StepIndicator } from "@/components/CreatePost/StepIndicator";
import { Step1SelectPlatform } from "@/components/CreatePost/Step1SelectPlatform";
import { Step2UploadImages } from "@/components/CreatePost/Step2UploadImages";
import { Step3AddDescription } from "@/components/CreatePost/Step3AddDescription";
import { Step4ReviewContent } from "@/components/CreatePost/Step4ReviewContent";
import { ProcessingStatus } from "@/components/CreatePost/ProcessingStatus";

const TOTAL_STEPS = 4;

export default function CreatePost() {
  const navigate = useNavigate();
  const { accounts } = useSocialAccounts();
  const { create, loading, error, draftId, jobId, reset } = useCreateContent();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState({
    text: "",
    hashtags: "",
  });
  const [selectedCaption, setSelectedCaption] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [aiContent, setAiContent] = useState(null);
  const [agentStatuses, setAgentStatuses] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Polling for job status
  usePolling(
    async () => {
      if (jobId && isProcessing) {
        try {
          // In a real app, you'd fetch the job status here
          // For now, we'll simulate completion
          setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
          }, 5000);
        } catch (err) {
          console.error("Error polling job status:", err);
        }
      }
    },
    3000,
    jobId && isProcessing
  );

  // Validate current step
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedPlatforms.length > 0;
      case 2:
        return images.length > 0;
      case 3:
        return description.text.trim().length > 0;
      case 4:
        return selectedCaption && selectedHashtags.length > 0;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 4) {
      await handlePublish();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePublish = async () => {
    try {
      const formData = new FormData();

      // Add images
      images.forEach((img) => {
        formData.append("images", img.file);
      });

      // Add form data
      formData.append("caption", selectedCaption);
      formData.append("hashtags", selectedHashtags.join(","));
      formData.append("platforms", selectedPlatforms.join(","));
      if (selectedMusic) {
        formData.append("musicId", selectedMusic.id);
      }

      setIsProcessing(true);
      await create(formData);
    } catch (err) {
      console.error("Error publishing:", err);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Draft Created!
            </h2>
            <p className="text-gray-600 mb-6">
              Your content is being processed by AI. You can view it in your
              drafts.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/drafts")}
                className="flex-1"
              >
                View Drafts
              </Button>
              <Button
                onClick={() => {
                  reset();
                  setCurrentStep(1);
                  setImages([]);
                  setDescription({ text: "", hashtags: "" });
                  setSelectedPlatforms([]);
                  setShowSuccess(false);
                }}
                className="flex-1"
              >
                Create Another
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-purple-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Post
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Main Content */}
        <Card className="mb-8">
          <div className="p-8">
            {/* Step 1: Select Platforms */}
            {currentStep === 1 && (
              <Step1SelectPlatform
                selectedPlatforms={selectedPlatforms}
                onChange={setSelectedPlatforms}
              />
            )}

            {/* Step 2: Upload Images */}
            {currentStep === 2 && (
              <Step2UploadImages images={images} onImagesChange={setImages} />
            )}

            {/* Step 3: Add Description */}
            {currentStep === 3 && (
              <Step3AddDescription
                description={description}
                hashtags={description.hashtags}
                onChange={setDescription}
              />
            )}

            {/* Step 4: Review Content */}
            {currentStep === 4 && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Step4ReviewContent
                      images={images}
                      aiContent={aiContent}
                      selectedCaption={selectedCaption}
                      selectedHashtags={selectedHashtags}
                      selectedMusic={selectedMusic}
                      onCaptionChange={setSelectedCaption}
                      onHashtagChange={setSelectedHashtags}
                      onMusicChange={setSelectedMusic}
                      isProcessing={isProcessing}
                    />
                  </div>

                  {/* Processing Status */}
                  <div className="lg:col-span-1">
                    <ProcessingStatus agentStatuses={agentStatuses} />
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/drafts")}>
              Save Draft
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || loading || isProcessing}
              className="gap-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {currentStep === TOTAL_STEPS ? (
                <>{loading || isProcessing ? "Publishing..." : "Publish"}</>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
