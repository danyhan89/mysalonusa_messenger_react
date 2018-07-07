import React from "react";

import "bootstrap/scss/bootstrap-grid.scss";
import "tachyons/css/tachyons.css";

import styles from "./index.scss";
import LandingPage from "./LandingPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Routes: null
    };
  }

  componentDidMount() {
    import("./Routes").then(cmp => {
      this.setState({
        Routes: cmp.default
      });
    });
  }

  render() {
    const RoutesCmp = this.state.Routes;
    return (
      <div className={`${styles.app}`}>
        {RoutesCmp ? <RoutesCmp /> : null}
        <LandingPage start={!!RoutesCmp} />
      </div>
    );
  }
}

export default App;
