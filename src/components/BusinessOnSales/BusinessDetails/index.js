import React, { cloneElement } from "react";
import { findDOMNode, createPortal } from "react-dom";
import PropTypes from "prop-types";

import selectParent from "select-parent";

import join from "@app/join";
import cleanProps from "@app/cleanupProps";
import ellipsis from "@app/ellipsis";
import Label from "@app/Label";

import { renderDate } from "@app/dateUtils";

import { incrementBusinessView } from "src/api";

import styles from "./index.scss";

const DEFAULT_IMAGE =
  "https://s3.us-east-2.amazonaws.com/mysalonusa/uploads/cities/image.png";

import {
  heartFull as HEART_FULL_ICON,
  heartEmpty as HEART_EMPTY_ICON
} from "src/components/icons";

const locationIcon = (
  <svg
    className={styles.locationIcon}
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const EMPTY_PRICE = "0.00";

class BusinessDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.viewBusiness = this.viewBusiness.bind(this);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  componentDidMount() {
    this.props.data.image_urls.forEach((url, index) => {
      setTimeout(() => {
        if (this.unmounted) {
          return;
        }
        const image = new Image();
        image.src = url;
      }, (index + 1) * 200);
    });
  }

  onTransitionEnd() {
    this.setState({
      transitionStep: null
    });

    this.updateViews();
  }

  updateViews() {
    incrementBusinessView(this.props.data).then(({ views }) => {
      this.props.updateViews(this.props.data, views);
    });
  }

  viewBusiness(event) {
    const target = selectParent(`.${styles.business}`, event.target);
    const rect = target.getBoundingClientRect();

    const viewStyle = {
      width: target.offsetWidth,
      height: target.offsetHeight,
      top: rect.top,
      left: rect.left
    };

    this.setState(
      {
        viewing: true,
        transitionStep: "one",
        viewStyle
      },
      () => {
        this.setState({
          transitionStep: "two",
          viewStyle: {
            width: document.body.offsetWidth,
            height: document.body.offsetHeight,
            left: 0,
            top: 0
          }
        });
      }
    );
  }

  render() {
    const { style, className, data: business } = this.props;

    let transitionStyle;
    let transitionClassName;
    let events;

    const { viewing } = this.state;

    if (viewing) {
      if (this.state.transitionStep) {
        transitionStyle = this.state.viewStyle;
      }

      if (this.state.transitionStep == "two") {
        events = { onTransitionEnd: this.onTransitionEnd };
      }

      transitionClassName = join(
        this.state.transitionStep
          ? styles["step-" + this.state.transitionStep]
          : styles.finalState,
        this.state.transitionStep == "two" && styles.transitioning
      );
    }

    const heartFull = this.props.favorite;

    const topBar = (
      <div
        className={`${styles.titleLine} ${
          styles.textLayer
        } pa2 w-100 top-0 left-0 flex flex-row items-center ${
          !viewing ? "absolute" : ""
        }`}
      >
        <div
          title={business.title}
          className={`flex-auto nowrap overflow-hidden truncate fw5 f4 ${
            styles.title
          }`}
        >
          {business.title || ellipsis(business.description, 50)}{" "}
        </div>
        <div
          className={join(
            styles.location,
            "fw2 flex-none flex flex-row items-center"
          )}
        >
          {cloneElement(heartFull ? HEART_FULL_ICON : HEART_EMPTY_ICON, {
            className: styles.heartIcon,
            onClick: this.props.onFavoriteClick
          })}
          {locationIcon} {business.city ? business.city.name : "Unknown"}{" "}
          {this.renderCloseIcon()}
        </div>
      </div>
    );

    let price =
      business.price_string && business.price_string != EMPTY_PRICE ? (
        `$ ${business.price_string}`
      ) : (
        <Label>private</Label>
      );

    price = <div className={join(styles.price, "b flex-auto")}> {price}</div>;

    const result = (
      <div
        key="business"
        {...cleanProps(this.props, BusinessDetails.propTypes)}
        {...events}
        onClick={this.viewBusiness}
        style={{ ...style, ...transitionStyle }}
        className={join(
          transitionClassName,
          viewing && styles.viewing,
          "flex flex-column mv1  bg-white w-100 ",
          styles.business,
          className
        )}
      >
        {topBar}
        {viewing ? (
          this.renderContent()
        ) : (
          <img
            className={styles.img}
            src={business.image_urls[0] || DEFAULT_IMAGE}
          />
        )}

        <div
          className={join(
            styles.textLayer,
            !viewing && "absolute",
            "pa2  bottom-0 left-0 w-100 flex-none"
          )}
        >
          <div className="flex flex-row items-center">
            {price}
            <div className={`${styles.views} fw2 flex-none`}>
              {business.views || 0} <Label>views</Label>
            </div>
          </div>
        </div>
      </div>
    );

    if (viewing) {
      return createPortal(
        [
          result,
          <div key={business.id + "-placeholder"} style={{ transitionStyle }} />
        ],
        document.getElementById("overlay")
      );
    }

    return result;
  }
  renderContent() {
    const business = this.props.data;

    const fieldClassName = join(styles.field, "mb4 fw4 f4");
    const labelClassName = "db mb1 fw2 ";

    return (
      <div className={join(styles.content, "flex-auto overflow-auto")}>
        <div className="pa3 pb0">
          <div className={fieldClassName}>
            <label className={labelClassName}>
              <Label>contact</Label>
            </label>
            {business.contact_email}
          </div>
          <div className={fieldClassName}>
            <label className={labelClassName}>
              <Label>description</Label>
            </label>
            {business.description}
          </div>

          <div className={fieldClassName}>
            <label className={labelClassName}>
              <Label>postedAt</Label>
            </label>
            {renderDate(business.created_at)}
          </div>

          <div className={fieldClassName}>
            <label className={labelClassName}>
              <Label>images</Label>
            </label>
          </div>
        </div>
        <div className="flex flex-column">
          {business.image_urls.map((url, index) => {
            return (
              <img
                className={join(styles.contentImage, "mb4")}
                key={url}
                src={url || DEFAULT_IMAGE}
              />
            );
          })}
        </div>
      </div>
    );
  }
  renderCloseIcon() {
    if (!this.state.viewing) {
      return null;
    }

    return (
      <svg
        height="24"
        width="24"
        onClick={event => {
          event.stopPropagation();
          this.closePreview();
        }}
        className={join("ml4", styles.closeIcon)}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
    );
  }

  closePreview() {
    this.setState({
      viewing: null,
      viewStyle: null
    });
  }
}

BusinessDetails.propTypes = {
  updateViews: PropTypes.func,
  favorite: PropTypes.bool,
  onFavoriteClick: PropTypes.func
};

export default BusinessDetails;
