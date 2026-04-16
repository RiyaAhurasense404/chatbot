interface HeroPreviewProps {
    imageUrl: string
    mediaType?: 'image' | 'video'
  }

  export default function HeroPreview({ imageUrl, mediaType = 'image' }: HeroPreviewProps) {
    return (
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 font-poppins mb-3">
          Current media
        </p>
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
          {mediaType === 'video' ? (
            <video
              src={imageUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              controls
            />
          ) : (
            <img
              src={imageUrl}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    )
  }