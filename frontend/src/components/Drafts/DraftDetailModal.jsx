// filepath: /home/samadhan/Drive1/Projects/AutonomousHacks26/frontend/src/components/Drafts/DraftDetailModal.jsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Play,
  Pause,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
} from "lucide-react";
import { getDraftById } from "@/services/post.service";

export const DraftDetailModal = ({ draftId, onClose, onUpdate, onPublish }) => {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMusic, setActiveMusic] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const [selectedImageVariant, setSelectedImageVariant] = useState(null);

  useEffect(() => {
    fetchDraftDetails();
  }, [draftId]);

  useEffect(() => {
    // Cleanup audio when component unmounts
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
    };
  }, [audioElement]);

  const fetchDraftDetails = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching draft details for ID:", draftId);
      const response = await getDraftById(draftId);

      if (response.success) {
        console.log("📦 Full draft data:", response.data);

        // Log what we received
        console.log("Original Images:", response.data.originalImages);
        console.log("AI Generated Images:", response.data.aiGeneratedImages);
        console.log("AI Generated Video:", response.data.aiGeneratedVideo);
        console.log(
          "AI Generated Captions:",
          response.data.aiGeneratedCaptions
        );
        console.log("Music Suggestions:", response.data.musicSuggestions);

        setDraft(response.data);
      }
    } catch (error) {
      console.error("Error fetching draft:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayMusic = (track) => {
    if (!track.previewUrl) {
      alert("No preview available for this track");
      return;
    }

    // Stop current audio if playing different track
    if (audioElement && activeMusic?.previewUrl !== track.previewUrl) {
      audioElement.pause();
    }

    // If clicking same track, pause/resume
    if (activeMusic?.previewUrl === track.previewUrl && audioElement) {
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
        setActiveMusic(null);
        return;
      }
    } else {
      // Play new track
      const audio = new Audio(track.previewUrl);
      audio.addEventListener("ended", () => setActiveMusic(null));
      audio.play();
      setAudioElement(audio);
    }

    setActiveMusic(track);
  };

  const handleDownloadImage = (imageUrl, name) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = name || "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading draft details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!draft) {
    return null;
  }

  const hasAiContent =
    draft.aiGeneratedCaptions?.length > 0 ||
    draft.aiGeneratedImages?.length > 0 ||
    !!draft.aiGeneratedVideo ||
    draft.musicSuggestions?.length > 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {draft.originalCaption || "Draft Details"}
              </DialogTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="default">{draft.status}</Badge>
                {hasAiContent && (
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    ✨ AI Enhanced
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-white">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">
                <FileText className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="h-4 w-4 mr-2" />
                Images ({draft.originalImages?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="video" disabled={!draft.aiGeneratedVideo}>
                <Video className="h-4 w-4 mr-2" />
                Video {draft.aiGeneratedVideo && "✓"}
              </TabsTrigger>
              <TabsTrigger
                value="captions"
                disabled={!draft.aiGeneratedCaptions?.length}
              >
                <FileText className="h-4 w-4 mr-2" />
                Captions ({draft.aiGeneratedCaptions?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="music"
                disabled={!draft.musicSuggestions?.length}
              >
                <Music className="h-4 w-4 mr-2" />
                Music ({draft.musicSuggestions?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-white">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Caption
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {draft.selectedCaption ||
                        draft.originalCaption ||
                        "No caption"}
                    </p>
                  </div>

                  {draft.hashtags?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Hashtags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {draft.hashtags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag.startsWith("#") ? tag : `#${tag}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Platforms
                    </h3>
                    <div className="flex gap-2">
                      {draft.platforms?.map((platform) => (
                        <Badge key={platform} variant="outline">
                          {platform === "instagram" && "📷 Instagram"}
                          {platform === "facebook" && "👥 Facebook"}
                          {platform === "linkedin" && "💼 LinkedIn"}
                          {platform === "twitter" && "🐦 Twitter"}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {hasAiContent && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">
                        🤖 AI Enhancements
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
                        <div>
                          ✍️ {draft.aiGeneratedCaptions?.length || 0} captions
                          generated
                        </div>
                        <div>
                          🎨 {draft.aiGeneratedImages?.length || 0} image
                          variants
                        </div>
                        <div>
                          🎬{" "}
                          {draft.aiGeneratedVideo
                            ? "Video created"
                            : "No video"}
                        </div>
                        <div>
                          🎵 {draft.musicSuggestions?.length || 0} music
                          suggestions
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Original Images */}
                {draft.originalImages?.length > 0 && (
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        📸 Original Images
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {draft.originalImages.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={img.url}
                              alt={`Original ${idx + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => window.open(img.url, "_blank")}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    handleDownloadImage(
                                      img.url,
                                      `original-${idx + 1}.jpg`
                                    )
                                  }
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {img.width} × {img.height} • {img.format}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI Processed Images */}
                {draft.aiGeneratedImages?.length > 0 && (
                  <Card className="bg-white">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        🎨 AI Processed Variants
                      </h3>
                      {draft.aiGeneratedImages.map((imgGroup, groupIdx) => (
                        <div key={groupIdx} className="mb-6 last:mb-0">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">
                              Image {groupIdx + 1}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {imgGroup.variantCount} variants
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {imgGroup.variants?.map((variant, varIdx) => (
                              <div key={varIdx} className="relative group">
                                <img
                                  src={variant.url}
                                  alt={variant.name}
                                  className="w-full h-32 object-cover rounded-lg cursor-pointer"
                                  onClick={() =>
                                    setSelectedImageVariant(variant)
                                  }
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      handleDownloadImage(
                                        variant.url,
                                        `${variant.variant}.jpg`
                                      )
                                    }
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="mt-1 text-xs font-medium text-gray-700 text-center">
                                  {variant.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Video Tab */}
            <TabsContent value="video" className="space-y-4">
              {draft.aiGeneratedVideo && (
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          🎬 AI Generated Video
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {draft.aiGeneratedVideo.format?.toUpperCase()} •{" "}
                          {draft.aiGeneratedVideo.size} KB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDownloadImage(
                            draft.aiGeneratedVideo.url,
                            "ai-video.gif"
                          )
                        }
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                      <img
                        src={draft.aiGeneratedVideo.url}
                        alt="Generated video"
                        className="max-w-full max-h-96 rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Generated from:</strong>{" "}
                        <a
                          href={draft.aiGeneratedVideo.sourceImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View source image
                        </a>
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(
                          draft.aiGeneratedVideo.generatedAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Captions Tab */}
            <TabsContent value="captions" className="space-y-4">
              {draft.aiGeneratedCaptions?.map((caption, idx) => (
                <Card key={idx} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {caption.platform}
                        </Badge>
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {caption.text}
                        </p>
                      </div>
                    </div>
                    {caption.hashtags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                        {caption.hashtags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Music Tab - FIXED LAYOUT */}
            <TabsContent value="music" className="space-y-4">
              {draft.musicSuggestions?.map((track, idx) => (
                <Card key={idx} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      {/* Album Art */}
                      <div className="shrink-0 mx-auto md:mx-0">
                        {track.artwork ? (
                          <img
                            src={track.artwork}
                            alt={track.title}
                            className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover shadow-md"
                          />
                        ) : (
                          <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl shadow-md">
                            🎵
                          </div>
                        )}
                      </div>

                      {/* Track Info - Vertical Stack */}
                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">
                            {track.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{track.artist}</p>
                          {track.album && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                              Album: {track.album}
                            </p>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {track.mood && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700"
                            >
                              😊 {track.mood}
                            </Badge>
                          )}
                          {track.genre && (
                            <Badge
                              variant="outline"
                              className="bg-purple-50 text-purple-700"
                            >
                              🎼 {track.genre}
                            </Badge>
                          )}
                          {track.trackTime && (
                            <Badge variant="secondary">
                              ⏱️ {Math.floor(track.trackTime / 60)}:
                              {String(track.trackTime % 60).padStart(2, "0")}
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons - Horizontal on desktop, stacked on mobile */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          {track.previewUrl && (
                            <Button
                              size="sm"
                              variant={
                                activeMusic?.previewUrl === track.previewUrl
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => handlePlayMusic(track)}
                              className="gap-2 w-full sm:w-auto"
                            >
                              {activeMusic?.previewUrl === track.previewUrl &&
                              !audioElement?.paused ? (
                                <>
                                  <Pause className="h-4 w-4" />
                                  Pause Preview
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" />
                                  Play Preview
                                </>
                              )}
                            </Button>
                          )}
                          {track.iTunesUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(track.iTunesUrl, "_blank")
                              }
                              className="gap-2 w-full sm:w-auto"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open in iTunes
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Divider for mobile */}
                    {idx < draft.musicSuggestions.length - 1 && (
                      <div className="mt-6 pt-0 border-t border-gray-100 md:hidden"></div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t bg-white">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {draft.status === "ready" && (
            <Button
              onClick={() => onPublish(draft._id, draft.platforms)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Publish Now
            </Button>
          )}
        </div>

        {/* Image Zoom Modal */}
        {selectedImageVariant && (
          <Dialog
            open={true}
            onOpenChange={() => setSelectedImageVariant(null)}
          >
            <DialogContent className="max-w-4xl bg-white">
              <DialogHeader>
                <DialogTitle>{selectedImageVariant.name}</DialogTitle>
              </DialogHeader>
              <img
                src={selectedImageVariant.url}
                alt={selectedImageVariant.name}
                className="w-full rounded-lg"
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};
