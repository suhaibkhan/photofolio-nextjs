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
import IconButton from './icon-button';
import {
  VscChromeClose as Close,
  // VscChevronRight as Next,
  // VscChevronLeft as Prev,
} from 'react-icons/vsc';
import {
  AiOutlineExpand as FullScreen,
  AiOutlineShrink as FullScreenExit,
} from 'react-icons/ai';
import {
  IoGridSharp as Grid,
  IoChevronBackSharp as Prev,
  IoChevronForwardSharp as Next,
} from 'react-icons/io5';

import ImageGallery from './image-gallery';
import classNames from 'classnames';

const calcImagePosition = (
  image: ImageType,
  containerSize: Size,
  titleHeight: number,
  spacing: number | number[]
): Position => {
  const [ySpacing, xSpacing] = Array.isArray(spacing)
    ? spacing
    : [spacing, spacing];

  const { width, height } = containerSize;
  const contWidth = width - xSpacing * 2;
  const contHeight = height - ySpacing * 2 - (titleHeight + 50);

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
    top: (contHeight - imgHeight) / 2 + ySpacing,
    left: (contWidth - imgWidth) / 2 + xSpacing,
  };
};

type Props = {
  image: ImageType | null;
  spacing?: number | number[];
  curImageIdx: number;
  totalImages: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

const DEFAULTS = {
  spacing: [20, 40],
};

const ImagePreview: FunctionComponent<Props> = ({
  image,
  spacing = DEFAULTS.spacing,
  curImageIdx,
  totalImages,
  onClose,
  onNext,
  onPrev,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [containerSize, setContainerSize] = useState<Size | null>(null);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const enableNext = useMemo(
    () => curImageIdx >= 0 && curImageIdx < totalImages - 1,
    [curImageIdx, totalImages]
  );
  const enablePrev = useMemo(() => curImageIdx > 0, [curImageIdx]);

  const imagePosition = useMemo(() => {
    if (image && containerSize) {
      return calcImagePosition(
        image,
        containerSize,
        titleRef.current?.clientHeight || 0,
        spacing
      );
    }
    return null;
  }, [containerSize, image, spacing, titleRef.current]);

  const titlePosition = useMemo(
    () =>
      imagePosition ? { top: imagePosition.height + imagePosition.top } : null,
    [imagePosition]
  );

  const handleResize = useCallback(() => {
    if (containerRef.current && titleRef.current) {
      const contWidth = innerWidth(containerRef.current);
      const contHeight = innerHeight(containerRef.current);
      setContainerSize({
        width: contWidth,
        height: contHeight,
      });
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('resize', handleResize, true);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [image]);

  return (
    <div
      className={classNames(styles.imgPrevContainer, 'visible')}
      ref={containerRef}
    >
      <div className={styles.imgPrevParent} style={imagePosition || undefined}>
        <ImageGallery image={image} />
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
      <div
        className={classNames(styles.imgPrevIconBtns, styles.imgPrevCloseBtns)}
      >
        <IconButton icon={Close} size={30} onClick={onClose} />
      </div>

      <div
        className={classNames(styles.imgPrevIconBtns, styles.imgPrevMaxBtns)}
      >
        <IconButton
          icon={fullScreen ? FullScreenExit : FullScreen}
          size={24}
          onClick={() => setFullScreen((prevState) => !prevState)}
        />
      </div>

      <div
        className={classNames(
          styles.imgPrevIconBtns,
          styles.imgPrevNavBtns,
          styles.imgPrevNextIcon,
          {
            [styles.imgPrevIconDisable]: !enableNext,
          }
        )}
      >
        <IconButton icon={Next} size={34} onClick={enableNext && onNext} />
      </div>
      <div
        className={classNames(
          styles.imgPrevIconBtns,
          styles.imgPrevNavBtns,
          styles.imgPrevBackIcon,
          {
            [styles.imgPrevIconDisable]: !enablePrev,
          }
        )}
      >
        <IconButton icon={Prev} size={34} onClick={enablePrev && onPrev} />
      </div>
      <div className={styles.imgPrevToolbar}>
        <IconButton icon={Grid} size={18} onClick={onClose} label="Gallery" />
        <IconButton
          icon={Prev}
          size={18}
          onClick={enablePrev && onPrev}
          label="Prev"
          disable={!enablePrev}
        />
        <span className={styles.imgPrevNavStatus}>{`${
          curImageIdx + 1
        } / ${totalImages}`}</span>
        <IconButton
          icon={Next}
          size={18}
          onClick={enableNext && onNext}
          label="Next"
          textFirst
          disable={!enableNext}
        />
      </div>
    </div>
  );
};

export default ImagePreview;
