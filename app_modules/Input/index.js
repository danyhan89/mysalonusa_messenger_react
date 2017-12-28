import React from 'react'

import join from '@app/join'

import styles from './index.scss'

const stopPropagation = (e) => e.stopPropagation()

const Input = ({ tag, type, onChange, value, className, autoFocus = true, stopChangePropagation = true, ...props }) => {
  const Tag = tag || 'input'
  return <Tag
    {...props}
    type={type || "text"}
    onChange={(event) => {
      if (onChange) {
        onChange(event.target.value, event)
      }
      if (stopChangePropagation) {
        stopPropagation(event)
      }
    }}
    value={value}
    className={join(`${styles.input} br3 pa3 `, className)}
    autoFocus={autoFocus}
  />
}
export default Input