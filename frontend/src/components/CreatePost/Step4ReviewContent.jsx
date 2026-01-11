import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getDraftById } from "@/services/post.service";

export const Step4ReviewContent = ({ images, draftId, isProcessing }) => {
  const [aiContent, setAiContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;
    let pollCount = 0;
    const maxPolls = 40; // Poll for max 2 minutes (40 * 3 seconds)

    const fetchDraftStatus = async () => {
      if (!draftId) {
        console.log("⚠️  No draftId provided");
        return;
      }

      pollCount++;
      console.log(
        `📊 Polling draft status (attempt ${pollCount}/${maxPolls}):`,
        draftId
      );

      try {
        const response = await getDraftById(draftId);
        console.log("📦 Draft response:", response);

        if (response.success && response.data) {
          console.log("✅ Draft data received:", {
            status: response.data.status,
            processingComplete: response.data.processingComplete,
            aiResults: response.data.aiResults,
          });

          setAiContent(response.data.aiResults);

          // Log complete URLs
          if (response.data.originalImages?.length > 0) {
            console.log("\n📸 ORIGINAL IMAGES:");
            response.data.originalImages.forEach((img, i) => {
              console.log(`   Image ${i + 1}: ${img.url}`);
            });
          }

          if (response.data.aiGeneratedVideo) {
            console.log("\n🎬 GENERATED VIDEO:");
            console.log(
              `   URL: ${response.data.aiGeneratedVideo.url?.substring(
                0,
                200
              )}...`
            );
            console.log(`   Format: ${response.data.aiGeneratedVideo.format}`);
            console.log(`   Size: ${response.data.aiGeneratedVideo.size} KB`);
          }

          if (response.data.aiGeneratedImages?.length > 0) {
            console.log("\n🎨 PROCESSED IMAGES:");
            console.log(
              `   Total: ${response.data.aiGeneratedImages.length} image variants`
            );
          }

          if (response.data.musicSuggestions?.length > 0) {
            console.log("\n🎵 MUSIC SUGGESTIONS:");
            response.data.musicSuggestions.forEach((track, i) => {
              console.log(`   ${i + 1}. ${track.title} - ${track.artist}`);
            });
          }

          // Stop polling if processing is complete
          if (
            response.data.processingComplete ||
            response.data.status === "ready"
          ) {
            console.log("✅ Processing complete! Stopping poll...");
            setLoading(false);
            if (interval) {
              clearInterval(interval);
            }
          }
        } else {
          console.warn("⚠️  Invalid response format:", response);
        }
      } catch (error) {
        console.error("❌ Error fetching draft:", error);
        setError(error.message);

        // Stop polling after too many failures
        if (pollCount >= maxPolls) {
          console.log("⏱️  Max polling attempts reached");
          setLoading(false);
          if (interval) clearInterval(interval);
        }
      }
    };

    // Initial fetch with delay
    const initialTimeout = setTimeout(() => {
      fetchDraftStatus();
    }, 1000);

    // Poll every 3 seconds
    interval = setInterval(fetchDraftStatus, 3000);

    return () => {
      clearTimeout(initialTimeout);
      if (interval) clearInterval(interval);
    };
  }, [draftId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Customize
        </h2>
        <p className="text-gray-600">
          {loading
            ? "AI is processing your content..."
            : "AI processing complete!"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Image Preview */}
        <div>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
              {images && images.length > 0 && (
                <div className="space-y-3">
                  <img
                    src={images[0].preview}
                    alt="Preview"
                    className="w-full rounded-lg max-w-md"
                  />
                  <p className="text-xs text-gray-600">
                    {images.length} image{images.length > 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Processing Status */}
        <div>
          <Card>
            <CardContent className="p-6 space-y-6">
              {loading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    <p className="text-gray-700 font-medium">
                      AI agents are working on your content...
                    </p>
                  </div>

                  {/* Agent Status Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        name: "Caption",
                        icon: "✍️",
                        status:
                          aiContent?.captionsCount > 0
                            ? "complete"
                            : "processing",
                      },
                      {
                        name: "Images",
                        icon: "🎨",
                        status:
                          aiContent?.imagesCount > 0
                            ? "complete"
                            : "processing",
                      },
                      {
                        name: "Video",
                        icon: "🎬",
                        status: aiContent?.hasVideo ? "complete" : "processing",
                      },
                      {
                        name: "Music",
                        icon: "🎵",
                        status:
                          aiContent?.musicCount > 0 ? "complete" : "processing",
                      },
                    ].map((agent) => (
                      <div
                        key={agent.name}
                        className="p-4 border rounded-lg bg-gray-50"
                      >
                        <div className="text-center">
                          <span className="text-3xl">{agent.icon}</span>
                          <p className="font-medium text-sm text-gray-900 mt-2">
                            {agent.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {agent.status === "complete" ? (
                              <span className="text-green-600 font-medium">
                                ✓ Done
                              </span>
                            ) : (
                              <span className="text-blue-600">
                                Processing...
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-gray-600 text-center">
                    <p>This usually takes 30-120 seconds...</p>
                    <p className="text-xs mt-1">
                      Check the browser console for detailed logs
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">
                    Error loading draft
                  </p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Results Summary */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <span className="text-2xl">✅</span>
                      AI Processing Complete!
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                      <p>• {aiContent?.captionsCount || 0} captions</p>
                      <p>• {aiContent?.imagesCount || 0} image variants</p>
                      <p>• {aiContent?.hasVideo ? "Video ✓" : "No video"}</p>
                      <p>• {aiContent?.musicCount || 0} music tracks</p>
                    </div>
                  </div>

                  {/* Display Generated Captions */}
                  {aiContent?.captions && aiContent.captions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>✍️</span> Generated Captions
                      </h4>
                      <div className="space-y-3">
                        {aiContent.captions.map((caption, idx) => (
                          <div
                            key={idx}
                            className="p-4 border-2 rounded-lg hover:border-purple-400 transition-colors bg-white"
                          >
                            <p className="text-sm text-gray-800 mb-3 whitespace-pre-wrap">
                              {caption.text}
                            </p>
                            {caption.hashtags &&
                              caption.hashtags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {caption.hashtags.map((tag, i) => (
                                    <span
                                      key={i}
                                      className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Display Music Suggestions */}
                  {aiContent?.musicSuggestions &&
                    aiContent.musicSuggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span>🎵</span> Music Suggestions
                        </h4>
                        <div className="space-y-2">
                          {aiContent.musicSuggestions
                            .slice(0, 5)
                            .map((track, idx) => (
                              <div
                                key={idx}
                                className="p-3 border rounded-lg flex items-center gap-3 hover:bg-gray-50 transition-colors"
                              >
                                <span className="text-2xl">🎵</span>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {track.title}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {track.artist} • {track.genre}
                                  </p>
                                </div>
                                {track.mood && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {track.mood}
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
