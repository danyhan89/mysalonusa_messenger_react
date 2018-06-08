import React from "react";

class LoginForm extends React.Component {
  render() {
    return (
      <div>
        {" "}
        <a href={`${process.env.SERVER_URL}/auth/google`}>login with google</a>
      </div>
    );
  }
}

export default LoginForm;
