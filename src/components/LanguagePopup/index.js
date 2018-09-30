import React from 'react';

import LANGUAGES from 'src/languages';

import usFlag from 'src/images/us.png';
import koFlag from 'src/images/kr.png';
import moFlag from 'src/images/mn.png';
import voFlag from 'src/images/vn.png';

import PopupScreen from '../PopupScreen';

export const pngFlags = {
  ko: koFlag,
  en: usFlag,
  vo: voFlag,
  mo: moFlag
};

import styles from './index.scss';

const LanguagePopup = ({ onChange }) => {
  return (
    <PopupScreen
      title="Please choose your language"
      step={0}
      onChange={onChange}
      items={LANGUAGES.map(lang => {
        return {
          value: lang.value,
          render: () => (
            <div className={`${styles.lang} pa2`}>
              <div className="pv1">{lang.name}</div>
              <div
                className="mt2 aspect-ratio aspect-ratio--16x9 w-100"
                style={{
                  background: `url(${pngFlags[lang.value]}) no-repeat`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              />
            </div>
          )
        };
      })}
    />
  );
};

export default LanguagePopup;
