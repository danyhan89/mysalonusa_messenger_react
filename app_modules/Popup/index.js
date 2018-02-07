import React from 'react'
import { createPortal } from 'react-dom'

import Label from '@app/Label'
import join from '@app/join'

const stopPropagation = e => e.stopPropagation();

const Popup = ({ children, className, ...props }) => {

  return (
    createPortal(<div {...props} className={join('fixed flex justify-center items-center absolute--fill border flex flex-column')}>
      <div className="absolute absolute--fill bg-gray o-30"></div>
      <div className="bg-white pa3 br3 z-1">
        {children}
      </div>


    </div>, document.getElementById('overlay'))
  );
};

export default Popup;