import React from 'react'

import Label from '@app/Label'

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


const Overlay = ({ children, onClick, closeable, onClose }) => {

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
    <div onClick={onClickHandler} className={styles.overlay}>
      {children}

      {closeIcon}
    </div>
  );
};

export default Overlay;