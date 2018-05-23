import React, { Component } from "react";
import styles from "./index.scss";

import join from "@app/join";

import JobList, { registerFavoriteChange, getFavoriteJobs } from "../JobList";

const getFavoriteIds = (favoriteJobs = getFavoriteJobs()) => {
  return Object.keys(favoriteJobs).map(id => id);
};
class FavoritesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      favorites: getFavoriteIds()
    };
  }

  componentDidMount() {
    this.unregister = registerFavoriteChange(favoriteJobs => {
      this.setState({
        favorites: getFavoriteIds(favoriteJobs)
      });
    });
  }
  componentWillUnmount() {
    this.unregister();
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
          filter={this.state.favorites}
        />
      </div>
    );
  }
}

export default FavoritesPage;
