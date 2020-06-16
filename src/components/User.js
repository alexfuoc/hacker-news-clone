import React, { Component } from "react";
import { dateConverter, createMarkup } from "../utils/helpers";
import { fetchUser, fetchPosts } from "../utils/api";
import Loading from "./Loading";
import MetaInfo from "./MetaInfo";
import queryString from "query-string";
import { ThemeConsumer } from "../contexts/theme";

function PostList({ posts }) {
  posts = posts.length > 50 ? posts.slice(0, 50) : posts;
  //  if (posts !== null) {
  //    console.log("posts during rendered postlist", posts);
  //  }

  return (
    <div>
      <ul className="commentText">
        {posts.map((post) => (
          <li key={post.id} className="shadowing">
            <a
              href={post.url ? post.url : `/post?id=${post.id}`}
              className="link"
            >
              {post.title}
            </a>
            <div className="meta-info-light">
              <MetaInfo
                user={post.by}
                time={post.time}
                id={post.id}
                comments={post.descendants}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export class UserPosts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingPosts: true,
      posts: null,
      error: null,
    };

    this.loadPosts = this.loadPosts.bind(this);
  }

  componentDidMount() {
    this.loadPosts(this.props.userPosts);
  }

  loadPosts(postIds) {
    fetchPosts(postIds)
      .then((posts) =>
        this.setState({
          posts,
          loadingPosts: false,
        })
      )
      .catch(({ message }) =>
        this.setState({
          error: message,
        })
      );
  }

  render() {
    const { posts, error, loadingPosts } = this.state;

    if (error) {
      return <p>{error}</p>;
    }

    if (loadingPosts) {
      return <Loading text={"Loading posts"} />;
    }

    return (
      <React.Fragment>
        <PostList posts={posts} />
      </React.Fragment>
    );
  }
}

export default class User extends Component {
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
    const userId = queryString.parse(this.props.location.search);
    console.log("Loading Users...", userId.id);
    fetchUser(userId.id)
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
    const { user, loading, error } = this.state;

    if (error) {
      return <p>{error}</p>;
    }

    if (loading) {
      return <Loading text={"Fetching user"} />;
    }

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <React.Fragment>
            <h1 className="header-lg">{user.id}</h1>
            <div className={`meta-info-${theme}`}>
              <span>
                joined <b>{dateConverter(user.created)}</b>{" "}
              </span>
              <span>
                has <b>{user.karma}</b> karma
              </span>
            </div>
            {user.about ? (
              <div dangerouslySetInnerHTML={createMarkup(user.about)} />
            ) : (
              ""
            )}
            <h2>Posts</h2>
            {user.submitted >= 0 ? (
              <p>No Posts Yet</p>
            ) : (
              <UserPosts userPosts={user.submitted} />
            )}
          </React.Fragment>
        )}
      </ThemeConsumer>
    );
  }
}
