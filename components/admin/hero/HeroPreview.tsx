interface HeroPreviewProps {
    imageUrl: string
  }
  
  export default function HeroPreview({ imageUrl }: HeroPreviewProps) {
    return (
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 font-poppins mb-3">
          Current image
        </p>
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    )
  }