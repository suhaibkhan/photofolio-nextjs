import type { NextPageWithLayout } from './_app';
import { ReactElement, useCallback, useState } from 'react';

// import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
// import { images } from '../_data/image-data';
// import ImageGrid from '../components/image-grid';
// import ImagePreview from '../components/image-preview';
// import { useRouter } from 'next/router';

type Props = {};

const Home: NextPageWithLayout<Props> = () => {
  // const router = useRouter();
  // const [previewImageIdx, setPreviewImageIdx] = useState<number>(-1);
  // const handleOnClose = useCallback(() => setPreviewImageIdx(-1), []);
  // const handleOnNext = useCallback(
  //   () => setPreviewImageIdx((prevIdx) => prevIdx + 1),
  //   []
  // );
  // const handleOnPrev = useCallback(
  //   () => setPreviewImageIdx((prevIdx) => prevIdx - 1),
  //   []
  // );

  // const handleImageClick = useCallback((imageIdx: number) => {
  //   router.push({
  //     pathname: '/photos/[pid]',
  //     query: { pid: imageIdx },
  //   });
  // }, []);

  return null;
};

Home.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Home;
