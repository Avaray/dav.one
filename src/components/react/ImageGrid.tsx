type ImageType = {
  src: { src: string };
  alt?: string;
};

export default function ImageGrid({ images }: { images: ImageType[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
      {images.map((image, index) => (
        <img
          // Using index as key is not recommended, but it's fine here because the images are static
          key={index}
          src={image.src.src}
          alt={image.alt}
          className="w-full h-full object-cover"
        />
      ))}
    </div>
  );
}
