import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ImageUploader = ({ onImagesSelect, maxFiles = 10 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      alert("Please upload image files");
      return;
    }

    const previews = imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file,
            preview: e.target.result,
            id: Math.random().toString(36).substr(2, 9),
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then((results) => {
      onImagesSelect(results);
    });
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300",
        isDragging
          ? "border-purple-500 bg-purple-50"
          : "border-gray-300 bg-gray-50 hover:border-purple-400"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <Upload className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Drag images here
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          or click to browse (up to {maxFiles} images)
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("image-input")?.click()}
        >
          Browse Files
        </Button>
        <input
          id="image-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
        />
      </div>
    </div>
  );
};
