import React from "react";

import { withRouter, Redirect } from "react-router-dom";

import LoginForm from "./LoginForm";

const qs = {
  parse: str => {
    const keysAndValues = str.substring(1).split("=");

    return keysAndValues.reduce((acc, item, index) => {
      if (index % 2 == 0) {
        acc[item] = decodeURIComponent(keysAndValues[index + 1]);
      }
      return acc;
    }, {});
  }
};

export const setUser = user => {
  localStorage.setItem("loggedUser", JSON.stringify(user));
  return user;
};

export const getUser = () => {
  const user = localStorage.getItem("loggedUser");

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
