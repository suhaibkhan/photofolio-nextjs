import type { NextPageWithLayout } from './_app';
import { ReactElement, useCallback, useState } from 'react';

import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
import { images } from '../_data/image-data';
import ImageGrid from '../components/image-grid';
import ImagePreview from '../components/image-preview';

type Props = {};

const Home: NextPageWithLayout<Props> = () => {
  const [previewImageIdx, setPreviewImageIdx] = useState<number>(-1);
  const handleOnClose = useCallback(() => setPreviewImageIdx(-1), []);
  const handleOnNext = useCallback(
    () => setPreviewImageIdx((prevIdx) => prevIdx + 1),
    []
  );
  const handleOnPrev = useCallback(
    () => setPreviewImageIdx((prevIdx) => prevIdx - 1),
    []
  );

  return (
    <>
      <div className={styles.imageGrid}>
        <ImageGrid
          images={images}
          imagePath="/api/image-thumb"
          onClick={setPreviewImageIdx}
        />
      </div>

      <ImagePreview
        image={previewImageIdx >= 0 ? images[previewImageIdx] : null}
        enableNext={previewImageIdx < images.length - 1}
        enablePrev={previewImageIdx > 0}
        onClose={handleOnClose}
        onNext={handleOnNext}
        onPrev={handleOnPrev}
      />
    </>
  );
};

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Home;
