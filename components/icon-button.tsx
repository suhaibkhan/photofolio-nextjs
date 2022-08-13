import type { FunctionComponent } from 'react';
import styles from '../styles/icon-button.module.css';
import { IconType } from 'react-icons/lib';

type Props = {
  icon: IconType;
  size?: number;
  onClick?: () => void;
};

const IconButton: FunctionComponent<Props> = ({
  icon: Icon,
  size = 24,
  onClick,
}) => {
  return (
    <div onClick={onClick} className={styles.iconButton}>
      <Icon size={size} />
    </div>
  );
};

export default IconButton;
