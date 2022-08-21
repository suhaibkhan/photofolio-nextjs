import { FunctionComponent, memo } from 'react';
import styles from '../styles/icon-button.module.css';
import { IconType } from 'react-icons/lib';
import classNames from 'classnames';

type Props = {
  icon: IconType;
  size?: number;
  label?: string;
  textFirst?: boolean;
  disable?: boolean;
  onClick?: (() => void) | false;
};

const ICON_PADDING = 4;

const IconButton: FunctionComponent<Props> = ({
  icon: Icon,
  size = 24,
  onClick,
  label,
  textFirst = false,
  disable = false,
}) => {
  return (
    <div
      onClick={onClick || undefined}
      className={classNames(styles.iconButton, {
        [styles.textFirstIcon]: textFirst,
        [styles.disabledIcon]: disable,
      })}
      style={{ height: size + ICON_PADDING * 2 }}
    >
      <Icon size={size} />
      {!label && <span className={styles.iconLabel}>{label}</span>}
    </div>
  );
};

export default memo(IconButton);
