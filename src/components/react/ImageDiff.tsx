type ImageType = {
  src: { src: string };
  alt?: string;
};

export default function ImageDiff({ images }: { images: ImageType[] }) {
  return (
    <div className="border-rd-2 diff aspect-[16/9] w-100 not-prose">
      <div className="diff-item-1">
        <img src={images[0].src.src} alt={images[0].alt} />
      </div>
      <div className="diff-item-2">
        <img src={images[1].src.src} alt={images[1].alt} />
      </div>
      <div className="diff-resizer w-50" />
    </div>
  );
}
