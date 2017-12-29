import React from 'react'

import Label from '@app/Label'
import join from '@app/join'

import styles from './index.scss'

const stopPropagation = e => e.stopPropagation();


const renderCloseIcon = ({ onClick }) => (
  <div onClick={onClick} className={styles.closeIcon}>
    <svg
      height="44"
      width="44"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
    <div>
      <Label>close</Label>
    </div>
  </div>
);


const Overlay = ({ tag, children, onClick, closeable, onClose, className, ...props }) => {

  const Tag = tag || 'div'
  const onClickHandler = onClick ? (event) => {
    stopPropagation(event);
    onClick(event)
  } : stopPropagation

  let closeIcon

  if (closeable) {
    closeIcon = renderCloseIcon({
      onClick: onClose
    })
  }

  return (
    <Tag {...props} onClick={onClickHandler} className={join(styles.overlay, className)}>
      {children}

      {closeIcon}
    </Tag>
  );
};

export default Overlay;