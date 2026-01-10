import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ImagePreview = ({ images, onRemove, onReorder }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-gray-900 mb-4">
        Uploaded Images ({images.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-purple-400 transition-all"
          >
            <img
              src={image.preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/40 text-white"
                onClick={() => onRemove(image.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Index Badge */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
