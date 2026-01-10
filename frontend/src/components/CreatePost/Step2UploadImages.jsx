import { Card, CardContent } from "@/components/ui/card";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";

export const Step2UploadImages = ({ images, onImagesChange }) => {
  const handleRemoveImage = (imageId) => {
    onImagesChange(images.filter((img) => img.id !== imageId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Images</h2>
        <p className="text-gray-600">
          Add high-quality images for your post (up to 10 images)
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <ImageUploader
            onImagesSelect={(newImages) =>
              onImagesChange([...images, ...newImages])
            }
            maxFiles={10}
          />
          <ImagePreview images={images} onRemove={handleRemoveImage} />
        </CardContent>
      </Card>

      {images.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <p className="text-sm font-medium">
            Please upload at least one image to continue
          </p>
        </div>
      )}
    </div>
  );
};
