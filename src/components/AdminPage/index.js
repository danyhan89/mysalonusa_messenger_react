import React from "react";

import { withRouter, Redirect } from "react-router-dom";
import qs from "query-string";
import LoginForm from "./LoginForm";

export const setUser = user => {
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const getUser = () => {
  const user = localStorage.getItem("user");

  if (user) {
    return JSON.parse(user);
  }
  return null;
};

class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: getUser()
    };

    this.logout = this.logout.bind(this);
  }
  logout() {
    setUser(null);
    this.setState({
      user: null
    });
  }
  getUserFromQuery(props) {
    const { location } = props;
    let user;

    if (location.search) {
      const query = qs.parse(location.search);

      if (query.user) {
        try {
          user = JSON.parse(query.user);
        } catch (ex) {}
      }
    }

    return user;
  }
  componentDidUpdate() {
    this.checkUser();
  }
  componentDidMount() {
    this.checkUser();
  }
  checkUser() {
    if (!this.state.user) {
      const user = this.getUserFromQuery(this.props);
      if (user) {
        setUser(user);
        this.setState({ user, redirect: true });
      }
    }
  }

  render() {
    const { user, redirect } = this.state;

    if (redirect && this.props.location.search) {
      return <Redirect to="/admin" />;
    }
    return (
      <div
        className="flex flex-row items-center justify-center"
        style={{ height: "100%" }}
      >
        {user ? (
          <div>
            Welcome {user.displayName}{" "}
            <button onClick={this.logout}>logout</button>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    );
  }
}

export default AdminPage;
