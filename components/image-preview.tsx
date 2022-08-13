import { ImageType, Position, PositionOnly, Size } from './image.model';
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
import IconButton from './icon-button';
import { VscChromeClose } from 'react-icons/vsc';
import { VscChevronRight } from 'react-icons/vsc';
import { VscChevronLeft } from 'react-icons/vsc';

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

  return {
    width: imgWidth,
    height: imgHeight,
    top: (contHeight - imgHeight) / 2 + spacing,
    left: (contWidth - imgWidth) / 2 + spacing,
  };
};

type NavIconPositions = {
  next: Partial<PositionOnly>;
  prev: Partial<PositionOnly>;
};

// const ICON_HEIGHT = 53;

// const calcNavIconPosition = (containerHeight: number): NavIconPositions => {
//   const iconTop = (containerHeight - ICON_HEIGHT) / 2;
//   return {
//     next: { top: iconTop, right: 0 },
//     prev: { top: iconTop, left: 0 },
//   };
// };

type Props = {
  image: ImageType | null;
  imagePath?: string;
  spacing?: number;
  enableNext: boolean;
  enablePrev: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

const DEFAULTS = {
  imagePath: '/images/photos',
  spacing: 40,
};

const ImagePreview: FunctionComponent<Props> = ({
  image,
  imagePath = DEFAULTS.imagePath,
  spacing = DEFAULTS.spacing,
  enableNext,
  enablePrev,
  onClose,
  onNext,
  onPrev,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [imageName, setImageName] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [imageStyle, setImageStyle] = useState<React.CSSProperties | null>(
    null
  );
  const [titlePosition, setTitlePosition] = useState<Partial<Position> | null>(
    null
  );

  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      opacity: !!image ? 1 : 0,
      visibility: !!image ? 'visible' : 'hidden',
    }),
    [image]
  );
  //   const iconPositions = useMemo(
  //     () => (containerHeight > 0 ? calcNavIconPosition(containerHeight) : null),
  //     [containerHeight]
  //   );

  const positionImage = useCallback(() => {
    if (containerRef.current && image) {
      const titleHeight = titleRef.current ? titleRef.current.clientHeight : 0;
      const contWidth = innerWidth(containerRef.current);
      const contHeight = innerHeight(containerRef.current);
      const imagePos = calcImagePosition(
        image,
        { width: contWidth, height: contHeight },
        titleHeight,
        spacing
      );

      setContainerHeight(contHeight);
      setImageStyle((prevStyle) => ({ ...prevStyle, ...imagePos }));
      setTitlePosition({ top: imagePos.height + imagePos.top });
    }
    setImageName(image ? image.name : null);
  }, [image]);

  const debouncePositionImage = useDebouncedCallback(positionImage, 100);

  useIsomorphicLayoutEffect(() => {
    positionImage();
  }, [image]);

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('resize', debouncePositionImage, true);
    return () => window.removeEventListener('resize', debouncePositionImage);
  }, []);

  const handleNav = (isNext: boolean) => () => {
    setImageName(null);
    setImageStyle((prevStyles) => ({
      ...prevStyles,
      opacity: 0,
    }));
    isNext && enableNext && onNext();
    !isNext && enablePrev && onPrev();
  };

  const handleImageLoaded = () => {
    setImageStyle((prevStyles) => ({
      ...prevStyles,
      opacity: 1,
    }));
  };

  return (
    <div
      className={styles.imgPrevContainer}
      style={containerStyle}
      ref={containerRef}
    >
      <div className={styles.imgPrevParent} style={imageStyle || undefined}>
        <img
          className={styles.imgPrevImage}
          src={imageName ? `${imagePath}/${imageName}` : undefined}
          onLoad={handleImageLoaded}
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
      <div className={styles.imgPrevCloseBtns}>
        <IconButton icon={VscChromeClose} size={32} onClick={onClose} />
      </div>
      <div
        className={`${styles.imgPrevIconBtns} ${styles.imgPrevNextIcon} ${
          !enableNext && styles.imgPrevIconDisable
        }`}
      >
        <IconButton
          icon={VscChevronRight}
          size={40}
          onClick={handleNav(true)}
        />
      </div>
      <div
        className={`${styles.imgPrevIconBtns} ${styles.imgPrevBackIcon} ${
          !enablePrev && styles.imgPrevIconDisable
        }`}
      >
        <IconButton
          icon={VscChevronLeft}
          size={40}
          onClick={handleNav(false)}
        />
      </div>
    </div>
  );
};

export default ImagePreview;
