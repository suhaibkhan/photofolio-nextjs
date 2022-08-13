import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { FunctionComponent } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import styles from '../styles/image-grid.module.css';
import Image from './image';
import { ImageType, Position, Size } from './image.model';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { innerWidth } from './dom-utils';

type ColumnConfig = number | { maxWidth: number; count: number }[];

const getColumns = (columnsConfig: ColumnConfig) => {
  if (typeof columnsConfig === 'number') {
    return columnsConfig;
  }

  if (Array.isArray(columnsConfig) && columnsConfig.length > 0) {
    const winWidth = window.innerWidth;
    const colOpts = columnsConfig.filter((item) => +item.maxWidth <= winWidth);
    if (colOpts.length > 0) {
      return colOpts[0].count;
    }
  }

  return 1;
};

const calcGridImagePositions = (
  images: ImageType[],
  containerWidth: number,
  spacing: number,
  columns: number
) => {
  const totalWidthSpacing = spacing * (columns - 1);
  const imgWidth = (containerWidth - totalWidthSpacing) / columns;

  const colHeights = Array(columns).fill(0);
  let i = 0;
  let col = 0;

  const imagePositions: Position[] = [];

  while (i < images.length) {
    const nextCol = (col + 1) % columns;

    // if column height before adding image is
    // already greater than next column, move current img to next col
    if (colHeights[col] > colHeights[nextCol]) {
      col = nextCol;
      continue;
    }

    // calculate each image height based column width and aspect ratio
    const { width, height } = images[i];
    const aRatio = height / width;
    const imgHeight = aRatio * imgWidth;

    // apply position styles
    imagePositions.push({
      height: imgHeight,
      width: imgWidth,
      top: colHeights[col],
      left: (imgWidth + spacing) * col,
    });

    colHeights[col] += imgHeight + spacing;
    // move to next col
    col = nextCol;
    // next image
    i++;
  }

  const containerSize: Size = {
    height: Math.max(...colHeights) - spacing,
    width: containerWidth,
  };

  return {
    imagePositions,
    containerSize,
  };
};

type Props = {
  images: ImageType[];
  imagePath?: string;
  spacing?: number;
  columns?: ColumnConfig;
  onClick?: (img: ImageType) => void;
};

const DEFAULTS = {
  imagePath: '/images/photos',
  spacing: 10,
  columns: [
    { maxWidth: 800, count: 2 },
    { maxWidth: 1400, count: 3 },
  ],
};

const ImageGrid: FunctionComponent<Props> = ({
  images,
  imagePath = DEFAULTS.imagePath,
  spacing = DEFAULTS.spacing,
  columns = DEFAULTS.columns,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // sort column config by max width
  const columnConfig = useMemo(
    () =>
      Array.isArray(columns)
        ? [...columns].sort((a, b) => +b.maxWidth - +a.maxWidth)
        : columns,
    [columns]
  );
  const [gridImagePositions, setGridImagePositions] = useState<Position[]>([]);
  const [gridContainerSize, setGridContainerSize] = useState<Size>();

  const positionImages = useCallback(() => {
    if (containerRef.current && containerRef.current.parentElement) {
      const containerWidth = innerWidth(containerRef.current.parentElement);

      const { imagePositions, containerSize } = calcGridImagePositions(
        images,
        containerWidth,
        spacing,
        getColumns(columnConfig)
      );
      setGridImagePositions(imagePositions);
      setGridContainerSize(containerSize);
    }
  }, []);

  const debouncePositionImages = useDebouncedCallback(positionImages, 100);

  useIsomorphicLayoutEffect(() => {
    window.addEventListener('resize', debouncePositionImages, true);
    positionImages();

    return () => window.removeEventListener('resize', debouncePositionImages);
  }, []);

  const hanldeImageClick = (img: ImageType) => () => {
    onClick && onClick(img);
  };

  return (
    <div
      ref={containerRef}
      style={gridContainerSize}
      className={styles.imageGridContainer}
    >
      {images.map((img, imgIdx) => (
        <div
          key={img.name}
          style={gridImagePositions[imgIdx]}
          className={styles.imageItem}
          onClick={hanldeImageClick(img)}
        >
          <Image src={`${imagePath}/${img.name}`} alt={img.title} />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
