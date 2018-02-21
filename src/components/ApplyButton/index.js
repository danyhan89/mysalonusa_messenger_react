import React from 'react'
import Label from '@app/Label'

import APPLY_ICON from './applyIcon'
import styles from './index.scss'

export default ({ onClick, className, size = 32 }) => <div
  onClick={onClick}
  className={`${className || ''} br3 ma1 ma3-ns pa1 pa3-ns f4 f3-ns flex items-center ${
    styles.apply
    }`}
>
  {APPLY_ICON({ size })} <Label>APPLY</Label>
</div>