import { ImgHTMLAttributes } from "react";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const LazyImage = ({ src, alt, className, ...props }: LazyImageProps) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    decoding="async"
    className={className}
    {...props}
  />
);

export default LazyImage;
