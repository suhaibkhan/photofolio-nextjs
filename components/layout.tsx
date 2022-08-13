import styles from '../styles/layout.module.css';
import type { FunctionComponent } from 'react';
import Head from 'next/head';

type Props = {
  children: React.ReactNode;
};

const Layout: FunctionComponent<Props> = ({ children }) => (
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
    <div className={styles.container}>{children}</div>
  </>
);

export default Layout;
