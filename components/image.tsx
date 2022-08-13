import { memo, useRef } from 'react';
import type { FunctionComponent } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

type Props = {
  src: string;
  alt?: string;
};

const Image: FunctionComponent<Props> = ({ src, alt }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const entry = useIntersectionObserver(imgRef, {
    rootMargin: '100px',
    threshold: 0.15,
    freezeOnceVisible: true,
  });
  const isInView = !!entry?.isIntersecting;

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      data-src={src}
      alt={alt}
    />
  );
};

export default memo(Image);
