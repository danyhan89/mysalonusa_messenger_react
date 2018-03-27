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
import BusinessDetails from "./BusinessDetails";

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

  renderBusiness(business, index) {
    return (
      <BusinessDetails
        updateViews={this.updateViews}
        key={business.id || index}
        data={business}
      />
    );
  }

  updateViews(business, views) {
    this.setState({
      data: this.state.data.map(b => {
        if (b.id == business.id) {
          b = { ...b, views };
        }

        return b;
      })
    });
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
