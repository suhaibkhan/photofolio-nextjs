import classNames from 'classnames';
import { FunctionComponent, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import styles from '../styles/image-gallery.module.css';
import { ImageType } from './image.model';
import { VscLoading } from 'react-icons/vsc';

type Props = {
  image: ImageType | null;
  imagePath?: string;
};

interface ImageState {
  firstImgName: string | null;
  secondImgName: string | null;
  showFirst: boolean;
  showSecond: boolean;
  loading: boolean;
}

const INIT_IMG_STATE: ImageState = {
  firstImgName: null,
  secondImgName: null,
  showFirst: false,
  showSecond: false,
  loading: false,
};

const ImageGallery: FunctionComponent<Props> = ({
  image,
  imagePath = '/images/photos',
}) => {
  const [imageState, setImageState] = useState<ImageState>(INIT_IMG_STATE);

  useIsomorphicLayoutEffect(() => {
    setImageState((prevState) => ({
      ...INIT_IMG_STATE,
      loading: !!image,
      [prevState.showFirst ? 'secondImgName' : 'firstImgName']: image
        ? image.name
        : null,
    }));
  }, [image]);

  const handleImageLoaded = (isFirstImg: boolean) => () => {
    const imgProp = isFirstImg ? 'showFirst' : 'showSecond';
    setImageState((prevState) => ({
      ...prevState,
      loading: false,
      [imgProp]: true,
    }));
  };

  const handleImageError = () => {
    setImageState((prevState) => ({
      ...prevState,
      loading: false,
    }));
  };

  return (
    <>
      {imageState.loading && (
        <VscLoading size={40} className={styles.galLoadingIcon} />
      )}
      <img
        className={classNames(styles.galMainImage, {
          hidden: !imageState.showFirst,
          visible: imageState.showFirst,
        })}
        src={
          imageState.firstImgName
            ? `${imagePath}/${imageState.firstImgName}`
            : undefined
        }
        onLoad={handleImageLoaded(true)}
        onError={handleImageError}
      />
      <img
        className={classNames(styles.galMainImage, {
          hidden: !imageState.showSecond,
          visible: imageState.showSecond,
        })}
        src={
          imageState.secondImgName
            ? `${imagePath}/${imageState.secondImgName}`
            : undefined
        }
        onLoad={handleImageLoaded(false)}
        onError={handleImageError}
      />
    </>
  );
};

export default ImageGallery;
