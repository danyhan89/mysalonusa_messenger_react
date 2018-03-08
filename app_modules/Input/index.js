import React from 'react'

import join from '@app/join'

import styles from './index.scss'

const stopPropagation = (e) => e.stopPropagation()

class Input extends React.Component {
  render() {
    const { tag, type, onChange, value, className, autoFocus = true, stopChangePropagation = true, ...props } = this.props
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
      className={join(`${styles.input} br2 pa2 `, className)}
      autoFocus={autoFocus}
    />
  }
}
export default Input