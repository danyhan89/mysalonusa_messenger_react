import React from "react";
import { withRouter } from "react-router-dom";
import Label from "@app/Label";
import Button from "@app/Button";
import Overlay from "@app/Overlay";
import LanguagePopup from "../LanguagePopup";
import StatesPopup from "../StatesPopup";
import styles from "./index.scss";

const preventDefault = e => e.preventDefault();

const Link = ({ children, onClick }) => {
  return (
    <a
      href=""
      className={`${styles.link} db mb2`}
      onClick={e => {
        preventDefault(e);
        onClick();
      }}
    >
      {children}
    </a>
  );
};
class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chooseLanguage: false,
      chooseState: false
    };
  }
  render() {
    return (
      <div className={`${styles.footer} ph2 tl`}>
        <div>
          <Link
            onClick={() => {
              this.setState({ chooseLanguage: true });
            }}
          >
            <Label>chooseLanguage</Label>
          </Link>
          <Link
            onClick={() => {
              this.setState({ chooseState: true });
            }}
          >
            <Label>chooseState</Label>
          </Link>
          {this.renderChooseState()}
          {this.renderChooseLanguage()}
        </div>
      </div>
    );
  }
  renderChooseLanguage() {
    if (!this.state.chooseLanguage) {
      return null;
    }

    return (
      <Overlay
        closeable
        onClose={() => {
          this.setState({
            chooseLanguage: false
          });
        }}
      >
        <LanguagePopup
          onChange={lang => {
            let url = `/${lang}`;
            if (this.props.state) {
              url += `/${this.props.state.toUpperCase()}/${lang}`;

              //if (this.props.community) {
              //url += `/${this.props.community}`;
              //}
            }
            this.props.history.push(url);
            this.setState({
              chooseLanguage: false
            });
          }}
        />
      </Overlay>
    );
  }

  renderChooseState() {
    if (!this.state.chooseState) {
      return null;
    }

    return (
      <Overlay
        closeable
        onClose={() => {
          this.setState({
            chooseState: false
          });
        }}
      >
        <StatesPopup
          onChange={state => {
            let url = `/${this.props.lang || "en"}`;

            url += `/${state.toUpperCase()}`;
            if (this.props.community) {
              url += `/${this.props.community}`;
            }

            this.props.history.push(url);
            this.setState({
              chooseState: false
            });
          }}
        />
      </Overlay>
    );
  }
}

export default withRouter(Footer);
