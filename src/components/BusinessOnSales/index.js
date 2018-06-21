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
    const loggedUser = localStorage.getItem("loggedUser")
      ? JSON.parse(localStorage.getItem("loggedUser"))
      : null;
    const isAdmin = loggedUser && loggedUser.admin;
    this.state = {
      loading: true,
      skip: 0,
      initialLoading: true,
      data: [],
      isAdmin
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
      filter: Array.isArray(filter) ? filter : undefined
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
          {this.showPaginationAt("top") ? (
            <PaginationToolbar
              skip={skip}
              className="mb3 mr3"
              totalCount={totalCount}
              limit={limit}
              onSkipChange={this.onSkipChange}
            />
          ) : null}
          <div style={{ flex: 1 }} />
          {this.props.showPostButton ? (
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
          ) : null}
        </div>
        {this.renderPostBusinessOverlay()}
        {this.renderBusinesses()}
        {this.showPaginationAt("bottom") ? (
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

  showPaginationAt(position) {
    const { pagination, paginationPosition, limit } = this.props;
    const { initialLoading, data } = this.state;

    if (!pagination) {
      return false;
    }
    if (position === "top") {
      if (paginationPosition === undefined || paginationPosition === "both") {
        return true;
      }
      return paginationPosition === position;
    }

    if (position === "bottom") {
      if (paginationPosition === undefined || paginationPosition === "both") {
        return !initialLoading && pagination && data.length > limit;
      }
      return paginationPosition === position;
    }
  }

  renderPostBusinessOverlay() {
    const { businessToEdit } = this.state;
    if (!this.state.showPostBusiness && !businessToEdit) {
      return null;
    }
    const close = () => {
      this.setState({ showPostBusiness: false, businessToEdit: null });
    };
    const defaultValues = businessToEdit
      ? {
          ...businessToEdit,
          email: businessToEdit.contact_email,
          price: businessToEdit.price_string
        }
      : null;
    return (
      <Overlay closeable onClose={close}>
        <PostBusinessForm
          onSuccess={() => {
            close();
            this.onSkipChange(0);
          }}
          admin={this.state.isAdmin}
          defaultValues={defaultValues}
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
        onEditClick={event => {
          event.stopPropagation();
          this.setState({
            businessToEdit: business
          });
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
  pagination: true,
  showPostButton: true,
  paginationPosition: "both"
};

BusinessOnSales.propTypes = {
  limit: PropTypes.number,
  pagination: PropTypes.bool
};
export default BusinessOnSales;
