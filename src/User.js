import React, { Component } from "react";
import dateConverter from "./utils/helpers";
import { fetchUser } from "./utils/api";
import Loading from "./Loading";
import UserPosts from "./UserPosts";

export class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      userPosts: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const { id } = this.props;

    console.log("Loading Users...", this.props.id);
    fetchUser(id)
      .then((user) =>
        this.setState({
          user: user,
          loading: false,
        })
      )
      .catch(({ message }) =>
        this.setState({
          error: message,
        })
      );
  }

  render() {
    const { user, loading } = this.state;

    if (loading) {
      return <Loading text={"Fetching user"} />;
    }

    return (
      <React.Fragment>
        <h1>{user.id}</h1>
        <span>
          joined <b>{dateConverter(user.created)}</b>{" "}
        </span>
        <span>
          has <b>{user.karma}</b> karma
        </span>
        <h2>Posts</h2>
        <UserPosts userPosts={user.submitted} />
      </React.Fragment>
    );
  }
}

export default User;