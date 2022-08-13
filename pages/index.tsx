import type { NextPageWithLayout } from './_app';
import { ReactElement, useState } from 'react';

import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
import { images } from '../_data/image-data';
import ImageGrid from '../components/image-grid';
import { ImageType } from '../components/image.model';
import ImagePreview from '../components/image-preview';

type Props = {};

const Home: NextPageWithLayout<Props> = () => {
  const [previewImage, setPreviewImage] = useState<ImageType | null>(null);

  return (
    <>
      <div className={styles.imageGrid}>
        <ImageGrid
          images={images}
          imagePath="/api/image-thumb"
          onClick={setPreviewImage}
        />
      </div>

      <ImagePreview
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </>
  );
};

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

// export const getStaticProps = async () => {
//   return {
//     props: { images: [] }
//   };
// };

export default Home;
