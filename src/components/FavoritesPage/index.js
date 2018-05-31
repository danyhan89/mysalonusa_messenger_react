import React, { Component } from "react";
import styles from "./index.scss";

import join from "@app/join";

import JobList, {
  registerFavoriteChange as registerFavoriteJobChange,
  getFavoriteJobs
} from "../JobList";
import BusinessOnSales, {
  registerFavoriteChange as registerFavoriteBusinessOnSalesChange,
  getFavoriteBusinesses
} from "../BusinessOnSales";

const getFavoriteJobIds = (favoriteJobs = getFavoriteJobs()) => {
  return Object.keys(favoriteJobs).map(id => id);
};

const getFavoriteBusinessIds = (
  favoriteBusinesses = getFavoriteBusinesses()
) => {
  return Object.keys(favoriteBusinesses).map(id => id);
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
    this.unregisterFavoriteBusinesses = registerFavoriteJobChange(
      favoriteBusinesses => {
        this.setState({
          favoriteBusinesses: getFavoriteBusinessIds(favoriteBusinesses)
        });
      }
    );
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
          "pa3 flex flex-column",
          styles.favoritesPage,
          className
        )}
      >
        <JobList
          state={state}
          community={community}
          filter={this.state.favoriteJobs}
        />

        <BusinessOnSales
          state={state}
          community={community}
          filter={this.state.favoriteBusinesses}
        />
      </div>
    );
  }
}

export default FavoritesPage;
