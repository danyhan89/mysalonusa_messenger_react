import React from "react";

import CITIES from "src/cities";

import styles from "./index.scss";

const CitiesPopup = ({ onChange }) => {
  return (
    <div className={styles.citiesPopup}>
      {CITIES.map(city => (
        <div
          key={city}
          className={styles.cityItem}
          onClick={() => {
            onChange(city);
          }}
        >
          {city}
        </div>
      ))}
    </div>
  );
};

export default CitiesPopup;
