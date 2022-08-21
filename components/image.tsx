import { memo, useRef, useState } from 'react';
import type { FunctionComponent } from 'react';
import {
  useIntersectionObserver,
  useIsomorphicLayoutEffect,
} from 'usehooks-ts';
import { useRouter } from 'next/router';

type Props = {
  src: string;
  alt?: string;
};

const BLANK_IMG =
  'data:image/gif;base64,R0lGODlhAQABAIAAAMzMzP///yH5BAUAAAEALAAAAAABAAEAAAICRAEAOw==';

const Image: FunctionComponent<Props> = ({ src, alt }) => {
  const router = useRouter();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const entry = useIntersectionObserver(imgRef, {
    freezeOnceVisible: true,
  });
  const [isInView, setIsInView] = useState(false);

  useIsomorphicLayoutEffect(() => {
    // not loaded, if not in home
    // once loaded, not removed
    !isInView &&
      setIsInView(!!entry?.isIntersecting && router.pathname === '/');
  }, [entry?.isIntersecting, router.pathname]);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : BLANK_IMG}
      data-src={src}
      alt={alt}
    />
  );
};

export default memo(Image);
