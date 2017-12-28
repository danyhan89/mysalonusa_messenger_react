import React from 'react'

import join from '@app/join'
import Button from '@app/Button'

import styles from './index.scss'

const ActionButton = ({ className, disabled, ...props }) => {
  return <Button
    {...props}
    disabled={disabled}
    className={join(`${styles.actionButton} f4`, className, disabled && styles.disabled)}
  />
}
export default ActionButton