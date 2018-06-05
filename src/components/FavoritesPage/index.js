import React, { Component } from "react";
import styles from "./index.scss";

import join from "@app/join";
import Label from "@app/Label";

import JobList, {
  registerFavoriteChange as registerFavoriteJobChange,
  getFavoriteJobs
} from "../JobList";
import BusinessOnSales, {
  registerFavoriteChange as registerFavoriteBusinessOnSalesChange,
  getFavoriteBusinesses
} from "../BusinessOnSales";

const getFavoriteJobIds = (favoriteJobs = getFavoriteJobs()) => {
  const result = Object.keys(favoriteJobs).map(id => id);
  if (!result.length) {
    return [-1];
  }

  return result;
};

const getFavoriteBusinessIds = (
  favoriteBusinesses = getFavoriteBusinesses()
) => {
  const result = Object.keys(favoriteBusinesses).map(id => id);
  if (!result.length) {
    return [-1];
  }

  return result;
};

class FavoritesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      favoriteJobs: getFavoriteJobIds(),
      favoriteBusinesses: getFavoriteBusinessIds()
    };
  }

  componentDidMount() {
    this.unregisterFavoriteJobs = registerFavoriteJobChange(favoriteJobs => {
      this.setState({
        favoriteJobs: getFavoriteJobIds(favoriteJobs)
      });
    });
    this.unregisterFavoriteBusinesses = registerFavoriteBusinessOnSalesChange(
      favoriteBusinesses => {
        this.setState({
          favoriteBusinesses: getFavoriteBusinessIds(favoriteBusinesses)
        });
      }
    );
  }

  getCount(array) {
    if (array.length === 1 && array[0] === -1) {
      return 0;
    }

    return array.length;
  }
  componentWillUnmount() {
    this.unregisterFavoriteJobs();
    this.unregisterFavoriteBusinesses();
  }
  render() {
    const { props } = this;
    const { className, state, community } = props;
    return (
      <div
        className={join(
          "pv3 flex flex-column",
          styles.favoritesPage,
          className
        )}
      >
        <div className={`f4 ph3 pv2 ${styles.header}`}>
          <Label>favoriteJobs</Label> ({this.getCount(this.state.favoriteJobs)})
        </div>
        <JobList
          showPostButton={false}
          state={state}
          community={community}
          filter={this.state.favoriteJobs}
          paginationPosition="bottom"
        />

        <div className={`f4 ph3 pv2 ${styles.header}`}>
          <Label>favoriteBusinesses</Label> ({this.getCount(
            this.state.favoriteBusinesses
          )})
        </div>
        <BusinessOnSales
          showPostButton={false}
          state={state}
          community={community}
          filter={this.state.favoriteBusinesses}
          paginationPosition="bottom"
        />
      </div>
    );
  }
}

export default FavoritesPage;
