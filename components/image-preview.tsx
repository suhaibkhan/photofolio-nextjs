import { ImageType, Position, Size } from './image.model';
import styles from '../styles/image-preview.module.css';
import { FunctionComponent, useCallback, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { innerHeight, innerWidth } from './dom-utils';
import { useDebouncedCallback } from 'use-debounce';
import IconButton from './icon-button';
import { VscChromeClose } from 'react-icons/vsc';
import { VscChevronRight } from 'react-icons/vsc';
import { VscChevronLeft } from 'react-icons/vsc';
import ImageGallery from './image-gallery';
import classNames from 'classnames';

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

type Props = {
  image: ImageType | null;
  spacing?: number;
  enableNext: boolean;
  enablePrev: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

const DEFAULTS = {
  spacing: 40,
};

const ImagePreview: FunctionComponent<Props> = ({
  image,
  spacing = DEFAULTS.spacing,
  enableNext,
  enablePrev,
  onClose,
  onNext,
  onPrev,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const [imagePosition, setImagePosition] = useState<Position | null>(null);
  const [titlePosition, setTitlePosition] = useState<Partial<Position> | null>(
    null
  );

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
      className={classNames(styles.imgPrevContainer, {
        hidden: !image,
        visible: !!image,
      })}
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
      <div className={styles.imgPrevCloseBtns}>
        <IconButton icon={VscChromeClose} size={32} onClick={onClose} />
      </div>
      <div
        className={classNames(styles.imgPrevIconBtns, styles.imgPrevNextIcon, {
          [styles.imgPrevIconDisable]: !enableNext,
        })}
      >
        <IconButton
          icon={VscChevronRight}
          size={40}
          onClick={enableNext && onNext}
        />
      </div>
      <div
        className={classNames(styles.imgPrevIconBtns, styles.imgPrevBackIcon, {
          [styles.imgPrevIconDisable]: !enablePrev,
        })}
      >
        <IconButton
          icon={VscChevronLeft}
          size={40}
          onClick={enablePrev && onPrev}
        />
      </div>
    </div>
  );
};

export default ImagePreview;
