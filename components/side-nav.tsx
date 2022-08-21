import { FunctionComponent, memo, useState } from 'react';
import styles from '../styles/side-nav.module.css';
import { AiOutlineInstagram, AiFillFacebook } from 'react-icons/ai';
import { VscMenu, VscArrowLeft } from 'react-icons/vsc';
import IconButton from './icon-button';
import classNames from 'classnames';

const NAV_ITEMS = [
  { label: 'Home', path: '#' },
  { label: 'Georgia', path: '#georgia' },
  { label: 'Dubai', path: '#dubai' },
  { label: 'Sharjah', path: '#sharjah' },
  { label: 'Landscapes', path: '#landscape' },
  { label: 'Cityscapes', path: '#cityscapes' },
  { label: 'Mountains', path: '#mountains' },
];

type Props = {};

const SideNav: FunctionComponent<Props> = ({}) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <div className={styles.sideNavMobHeader}>
        <div
          className={classNames(styles.sideNavMobHeaderBtns, {
            show: !drawerOpen,
          })}
        >
          <IconButton
            icon={VscMenu}
            size={30}
            onClick={() => setDrawerOpen(true)}
          />
        </div>
        <div
          className={classNames(styles.sideNavMobHeaderBtns, {
            show: drawerOpen,
          })}
        >
          <IconButton
            icon={VscArrowLeft}
            size={30}
            onClick={() => setDrawerOpen(false)}
          />
        </div>
        <img
          src={`${process.env.BASE_PATH || ''}/images/logo.png`}
          alt="Suhaib Khan Photography"
        />
      </div>
      <div
        className={classNames(styles.sideNavContainer, {
          [styles.showNav]: drawerOpen,
        })}
      >
        <div className={styles.sideNavHeader}>
          <img
            src={`${process.env.BASE_PATH || ''}/images/logo.png`}
            alt="Suhaib Khan Photography"
          />
        </div>
        <div className={styles.sideNavLinksContainer}>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <a href={item.path}>{item.label}</a>
              </li>
            ))}
          </ul>
          <div className={styles.sideNavSocialIcons}>
            <a
              href="https://www.instagram.com/suhaib_s_khan/"
              target="_blank"
              rel="noreferrer"
            >
              <AiOutlineInstagram size={36} />
            </a>
            <a href="#">
              <AiFillFacebook size={36} />
            </a>
          </div>
        </div>
        <div className={styles.sideNavCopyfooter}>
          &copy; <span>{new Date().getFullYear()}</span>, Suhaib Khan
          Photography.
          <br />
          All Rights Reserved
        </div>
      </div>
    </>
  );
};

export default memo(SideNav);
