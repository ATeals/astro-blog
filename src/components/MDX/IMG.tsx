export const IMG = ({ src, alt, title }: { src: string; alt: string; title?: string }) => {
  return (
    <div className="mx-auto py-10">
      <img src={src} alt={alt} title={title} className="my-0" />
      {alt && <p className="mt-0 text-center text-sm text-gray-400">{alt}</p>}
    </div>
  );
};
