import { useEffect, useRef, useState } from 'react';
import type { FunctionComponent } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

type Props = {
  src: string;
  alt?: string;
};

const Image: FunctionComponent<Props> = ({ src, alt }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  // const entry = useIntersectionObserver(imgRef, {
  //   rootMargin: '100px',
  //   threshold: 0.15,
  //   freezeOnceVisible: true,
  // });
  // const isInView = !!entry?.isIntersecting;
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setIsInView(true);
            imageObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.15,
      }
    );

    if (imgRef.current) {
      imageObserver.observe(imgRef.current);
    }
    return () => {
      if (imgRef.current) {
        imageObserver.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      data-src={src}
      alt={alt}
    />
  );
};

export default Image;
