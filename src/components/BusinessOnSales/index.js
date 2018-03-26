import React from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

import selectParent from "select-parent";

import join from "@app/join";
import ellipsis from "@app/ellipsis";
import Overlay from "@app/Overlay";

import { fetchBusinessOnSales, incrementJobView } from "src/api";

import Button from "@app/Button";
import Label from "@app/Label";
import PostJobForm from "src/components/PostAJob/PostJobForm";

import ApplyButton from "src/components/ApplyButton";
import ApplyOverlay from "src/components/ApplyOverlay";

import PaginationToolbar from "src/components/PaginationToolbar";

import styles from "./index.scss";
import ViewAndApply from "../ViewAndApply";

const DEFAULT_IMAGE =
  "https://s3.us-east-2.amazonaws.com/mysalonusa/uploads/cities/image.png";

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

class BusinessOnSales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      skip: 0,
      initialLoading: true,
      data: []
    };

    this.onSkipChange = this.onSkipChange.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.renderBusinesses = this.renderBusinesses.bind(this);
    this.updateViews = this.updateViews.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { state } = nextProps;

    if (state != this.props.state) {
      this.setState(
        {
          data: [],
          totalCount: 0
        },
        () => {
          this.fetchBusinessOnSales(0, nextProps);
        }
      );
    }
  }

  componentWillMount() {
    this.fetchBusinessOnSales(0);
  }

  onSkipChange(skip) {
    this.fetchBusinessOnSales(skip);
    this.setState({
      skip
    });
  }

  scrollToTop() {
    findDOMNode(this).parentNode.scrollTop = 0;
  }

  fetchBusinessOnSales(skip = 0, props = this.props) {
    const { state, limit } = props;
    this.setState({
      loading: true
    });
    fetchBusinessOnSales({
      skip,
      limit,
      state
    }).then(({ data, totalCount }) => {
      this.setState({
        data,
        loading: false,
        initialLoading: false,
        totalCount
      });
      this.scrollToTop();
    });
  }
  render() {
    const { totalCount, skip } = this.state;
    const { limit, pagination, className } = this.props;

    return (
      <div className={join("pa3 flex flex-column", styles.main, className)}>
        {pagination ? (
          <PaginationToolbar
            skip={skip}
            className="mb3"
            totalCount={totalCount}
            limit={limit}
            onSkipChange={this.onSkipChange}
          />
        ) : null}
        {this.renderBusinesses()}
        {!this.state.initialLoading && pagination ? (
          <PaginationToolbar
            skip={skip}
            totalCount={totalCount}
            limit={limit}
            onSkipChange={this.onSkipChange}
          />
        ) : null}
      </div>
    );
  }

  renderBusinesses() {
    const { data } = this.state;
    return (
      <div className={`${styles.container} w-100 mb3 `}>
        {data.map(this.renderBusiness, this)}
      </div>
    );
  }

  viewBusiness(business, event) {
    const target = selectParent(`.${styles.business}`, event.target);
    const rect = target.getBoundingClientRect();
    const viewStyle = {
      width: target.offsetWidth,
      height: target.offsetHeigh,
      top: rect.top,
      left: rect.left
    };

    this.setState(
      {
        viewBusiness: business,
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

  onTransitionEnd() {
    this.setState({
      transitionStep: null
    });
  }

  renderBusiness(business, index) {
    const topBar = (
      <div
        className={`${styles.titleLine} ${
          styles.textLayer
        } pa2 w-100 absolute top-0 left-0 flex flex-row items-center`}
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
          {locationIcon} New York
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

    let transitionStyle;
    let transitionClassName;
    let events;

    const viewing =
      this.state.viewBusiness && this.state.viewBusiness.id === business.id;

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
        this.state.transitionStep && styles.transitioning
      );
    }

    const result = (
      <div
        key={business.id || index}
        style={transitionStyle}
        className={join(
          "flex flex-column mh3 mv1  bg-white w-100 ",
          styles.business,
          transitionClassName,
          viewing && styles.viewing
        )}
        {...events}
        onClick={this.viewBusiness.bind(this, business)}
      >
        <svg
          className={styles.viewIcon}
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>

        {topBar}
        <img
          className={styles.img}
          src={business.image_urls[0] || DEFAULT_IMAGE}
        />
        <div
          className={join(
            styles.textLayer,
            "pa2 absolute bottom-0 left-0 w-100"
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
      return [
        result,
        <div key={business.id + "-placeholder"} style={{ transitionStyle }} />
      ];
    }

    return result;
  }

  updateViews(job) {
    /*
    incrementJobView(job).then(({ views }) => {
      this.setState({
        jobs: this.state.jobs.map(j => {
          if (j.id == job.id) {
            j = { ...j, views };
          }
 
          return j;
        })
      });
    });*/
  }
}

BusinessOnSales.defaultProps = {
  limit: 25,
  pagination: true
};

BusinessOnSales.propTypes = {
  limit: PropTypes.number,
  pagination: PropTypes.bool
};
export default BusinessOnSales;
