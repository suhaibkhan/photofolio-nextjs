import styles from '../styles/layout.module.css';
import { FunctionComponent, useCallback } from 'react';
import Head from 'next/head';
import SideNav from './side-nav';
import { images } from '../_data/image-data';
import ImageGrid from './image-grid';
import { useRouter } from 'next/router';
import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
};

const Layout: FunctionComponent<Props> = ({ children }) => {
  const router = useRouter();
  const handleImageClick = useCallback((imageIdx: number) => {
    router.push({
      pathname: '/photos/[pid]',
      query: { pid: imageIdx },
    });
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="title" content="Suhaib Khan Photography" />
        <meta
          name="description"
          content="Suhaib Khan is a Software Engineer and a Photography Enthusiast based in Dubai. Website features photography works by Suhaib Khan."
        />
        <meta
          name="keywords"
          content="suhaib khan, suhaib khan photography, photography, landscape photography, travel photography, mountains, cityscapes, UAE, Dubai, Sharjah, Georgia"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <title>Suhaib Khan Photography</title>
      </Head>
      <div className={styles.container}>
        <SideNav />

        <div
          className={classNames(styles.imageGrid, {
            hidden: router.pathname !== '/',
          })}
        >
          <ImageGrid
            images={images}
            imagePath="/api/image-thumb"
            onClick={handleImageClick}
          />
        </div>
        <div
          className={classNames(styles.content, {
            hide: router.pathname === '/',
          })}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
