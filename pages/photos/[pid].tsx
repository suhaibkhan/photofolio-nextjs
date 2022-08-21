import { useRouter } from 'next/router';
import { ReactElement, useCallback } from 'react';
import ImagePreview from '../../components/image-preview';
import Layout from '../../components/layout';
import { images } from '../../_data/image-data';
import type { NextPageWithLayout } from '../_app';

type Props = {};

const PhotoPost: NextPageWithLayout<Props> = () => {
  const router = useRouter();
  const imageIdx = router.query.pid ? +router.query.pid : -1;

  const handleOnClose = useCallback(() => {
    router.push('/');
  }, []);

  const handleOnNext = useCallback(() => {
    router.push({
      pathname: '/photos/[pid]',
      query: { pid: imageIdx + 1 },
    });
  }, [imageIdx]);

  const handleOnPrev = useCallback(() => {
    router.push({
      pathname: '/photos/[pid]',
      query: { pid: imageIdx - 1 },
    });
  }, [imageIdx]);

  return (
    <ImagePreview
      image={imageIdx >= 0 ? images[imageIdx] : null}
      curImageIdx={imageIdx}
      totalImages={images.length}
      onClose={handleOnClose}
      onNext={handleOnNext}
      onPrev={handleOnPrev}
    />
  );
};

PhotoPost.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default PhotoPost;
