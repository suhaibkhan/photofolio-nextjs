import { ImageType, Position, Size } from './image.model';
import styles from '../styles/image-preview.module.css';
import {
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { innerHeight, innerWidth } from './dom-utils';
import { useDebouncedCallback } from 'use-debounce';

const calcImagePosition = (
  image: ImageType,
  containerSize: Size,
  titleHeight: number,
  spacing: number
): Position => {
  const { width, height } = containerSize;
  const contWidth = width - spacing * 2;
  const contHeight = height - spacing * 2 - titleHeight;

  const contLandscape = contWidth >= contHeight;
  const aspRatio = image.height / image.width;

  let imgWidth = contLandscape ? contHeight / aspRatio : contWidth;
  let imgHeight = contLandscape ? contHeight : contWidth * aspRatio;

  if (imgHeight > contHeight) {
    imgHeight = contHeight;
    imgWidth = imgHeight / aspRatio;
  }

  if (imgWidth > contWidth) {
    imgWidth = contWidth;
    imgHeight = imgWidth * aspRatio;
  }

  // const titleTop = imgHeight + parseFloat(this.imgParent.style.top);

  return {
    width: imgWidth,
    height: imgHeight,
    top: (contHeight - imgHeight) / 2 + spacing,
    left: (contWidth - imgWidth) / 2 + spacing,
  };
};

type Props = {
  image: ImageType | null;
  imagePath?: string;
  spacing?: number;
  onClose: () => void;
};

const DEFAULTS = {
  imagePath: '/images/photos',
  spacing: 20,
};

const ImagePreview: FunctionComponent<Props> = ({
  image,
  imagePath = DEFAULTS.imagePath,
  spacing = DEFAULTS.spacing,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      opacity: !!image ? 1 : 0,
      visibility: !!image ? 'visible' : 'hidden',
    }),
    [image]
  );
  const [imagePosition, setImagePosition] = useState<Position | null>(null);
  const [titlePosition, setTitlePosition] = useState<Partial<Position> | null>(
    null
  );

  const positionImage = useCallback(() => {
    if (containerRef.current && image) {
      const titleHeight = titleRef.current ? titleRef.current.clientHeight : 0;
      const containerWidth = innerWidth(containerRef.current);
      const containerHeight = innerHeight(containerRef.current);
      const imagePos = calcImagePosition(
        image,
        { width: containerWidth, height: containerHeight },
        titleHeight,
        spacing
      );
      setImagePosition(imagePos);
      setTitlePosition({ top: imagePos.height + imagePos.top });
    }
  }, [image]);

  const debouncePositionImage = useDebouncedCallback(positionImage, 100);

  useIsomorphicLayoutEffect(() => {
    positionImage();
  }, [image]);

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('resize', debouncePositionImage, true);
    return () => window.removeEventListener('resize', debouncePositionImage);
  }, []);

  return (
    <div
      className={styles.imgPrevContainer}
      style={containerStyle}
      ref={containerRef}
    >
      <div className={styles.imgPrevParent} style={imagePosition || undefined}>
        <img
          className={styles.imgPrevImage}
          src={image ? `${imagePath}/${image.name}` : undefined}
        />
      </div>
      <div
        ref={titleRef}
        className={styles.imgPrevTitle}
        style={titlePosition || undefined}
      >
        {image?.title && (
          <div className={styles.imgPrevTitleText}>{image.title}</div>
        )}
      </div>
      <div className={styles.imgPrevToolbar}>
        <div onClick={onClose}>close</div>
      </div>
    </div>
  );
};

export default ImagePreview;
