import React from "react";
import styles from "./index.scss";
import logoURL from "src/images/logo.png";
import { bluePrimary } from "@app/colors";

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: false
    };

    const polyScript = document.createElement("script");
    polyScript.src =
      "https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en";
    document.head.appendChild(polyScript);

    console.time("LOADED");
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.start && this.props.start) {
      console.timeEnd("LOADED");
      requestAnimationFrame(() => {
        this.setState({
          animate: true
        });
      });
    }
  }
  render() {
    return (
      <div
        className={`tc absolute absolute--fill flex flex-column justify-center items-center ${
          styles.landingPage
        }`}
        style={{
          opacity: this.state.animate ? 0 : 0.95,
          background: bluePrimary
        }}
      >
        <img src={logoURL} style={{ maxWidth: 500, width: "90%" }} />
        <div
          className={`b black ${styles.text1}`}
          style={{ letterSpacing: -1 }}
        >
          community communication
        </div>
        <div className={` b mt4 white ${styles.text2}`}>
          talk together and grow together
        </div>
      </div>
    );
  }
}
export default LandingPage;
