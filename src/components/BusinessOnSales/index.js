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

import PostBusinessForm from "src/components/PostBusinessForm";

import ApplyButton from "src/components/ApplyButton";
import ApplyOverlay from "src/components/ApplyOverlay";

import PaginationToolbar from "src/components/PaginationToolbar";

import styles from "./index.scss";
import ViewAndApply from "../ViewAndApply";
import BusinessDetails from "./BusinessDetails";

export const getFavoriteBusinesses = () => {
  let favoritedBusinesses = localStorage.getItem("favoriteBusinesses") || null;

  if (favoritedBusinesses) {
    try {
      favoritedBusinesses = JSON.parse(favoritedBusinesses);
    } catch (ex) {
      favoritedBusinesses = {};
    }
  }

  return favoritedBusinesses || {};
};

export const getFavoriteBusinessCount = () => {
  return Object.keys(FAVORITE_BUSINESSES).length;
};

let FAVORITE_BUSINESSES = getFavoriteBusinesses();

global.addEventListener("storage", function(e) {
  FAVORITE_BUSINESSES = getFavoriteBusinesses();

  notifyFavoriteListeners();
});

let favoriteListeners = [];

const notifyFavoriteListeners = (favoriteJobs = FAVORITE_BUSINESSES) => {
  favoriteListeners.forEach(listener => {
    listener(favoriteJobs);
  });
};
export const registerFavoriteChange = listener => {
  favoriteListeners = [...favoriteListeners, listener];

  return () => {
    unregisterFavoriteChange(listener);
  };
};

export const unregisterFavoriteChange = listener => {
  favoriteListeners = favoriteListeners.filter(l => l !== listener);
};

export const isBusinessFavorite = jobId => {
  return !!FAVORITE_BUSINESSES[jobId];
};

export const setBusinessFavorite = (businessId, favorite) => {
  const favoritedBusinesses = getFavoriteBusinesses();

  if (favorite) {
    favoritedBusinesses[businessId] = 1;
  } else {
    delete favoritedBusinesses[businessId];
  }

  localStorage.setItem(
    "favoriteBusinesses",
    JSON.stringify(favoritedBusinesses)
  );

  FAVORITE_BUSINESSES = favoritedBusinesses;

  notifyFavoriteListeners();
};

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
    const { state, limit, filter } = props;
    this.setState({
      loading: true
    });
    fetchBusinessOnSales({
      skip,
      limit,
      state,
      filter: Array.isArray(filter) ? filter.join(",") : undefined
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
        <div className="flex flex-row flex-wrap">
          {pagination ? (
            <PaginationToolbar
              skip={skip}
              className="mb3 mr3"
              totalCount={totalCount}
              limit={limit}
              onSkipChange={this.onSkipChange}
            />
          ) : null}
          <div style={{ flex: 1 }} />
          <Button
            className="mb3  pv2 bg-white"
            onClick={() =>
              this.setState({
                showPostBusiness: true
              })
            }
          >
            <Label>postABusiness</Label>
          </Button>
        </div>
        {this.renderPostBusinessOverlay()}
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

  renderPostBusinessOverlay() {
    if (!this.state.showPostBusiness) {
      return null;
    }
    return (
      <Overlay
        closeable
        onClose={() => {
          this.setState({ showPostBusiness: false });
        }}
      >
        <PostBusinessForm
          onSuccess={() => {
            this.setState({ showPostBusiness: false });
            this.onSkipChange(0);
          }}
          xdefaultValues={{
            city: { id: 4, name: "a city" },
            state: "ca",
            title: "business title",
            description: "business description",
            email: "bla@business.com",
            price: 123
          }}
          xstep="price"
          lang={this.props.lang}
          state={this.props.state}
          community={this.props.community}
        />
      </Overlay>
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
    const favorite = isBusinessFavorite(business.id);
    return (
      <BusinessDetails
        favorite={favorite}
        onFavoriteClick={event => {
          event.stopPropagation();
          setBusinessFavorite(business.id, !favorite);
          this.forceUpdate();
        }}
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
