import React, { Component } from "react";
import { fetchPosts } from "./utils/api";
import Loading from "./Loading";
import dateConverter from "./utils/helpers";
import InfiniteScroll from "react-infinite-scroll-component";

function PostList({ posts }) {
  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={post.url ? post.url : "www.google.com"}>{post.title}</a>
            <span> by {post.by} </span>
            <span>at {dateConverter(post.time)} </span>
            <span>with {post.descendants} comments</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export class UserPostsInfiniteScroll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingPosts: true,
      posts: null,
      displayedPosts: [],
      hasMore: true,
      error: null,
    };

    this.loadPosts = this.loadPosts.bind(this);
  }

  componentDidMount() {
    this.loadPosts(this.props.userPosts);
  }

  loadPosts(postIds) {
    console.log("Loading Posts...", postIds);
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

  fetchMoreData = () => {
    if (this.state.displayedPosts.length >= 100) {
      this.setState({ hasMore: false });
      return;
    }
    // a fake async api call like which sends
    // 20 more records in .5 secs
    if (this.state.displayedPosts.length + 30 >= this.state.posts.length) {
      this.setState({
        displayedPosts: this.state.posts,
        hasMore: false,
      });
      return;
    }
    setTimeout(() => {
      this.setState({
        displayedPosts: this.state.displayedPosts.concat(
          this.state.posts.slice(
            this.state.displayedPosts.length,
            this.state.displayedPosts.length + 30
          )
        ),
      });
    }, 500);
  };

  render() {
    const { posts, displayedPosts, error, loadingPosts } = this.state;

    if (error) {
      return <p>{error}</p>;
    }

    if (loadingPosts) {
      return <Loading text={"Loading posts"} />;
    }

    if (posts) {
      console.log(posts);
    }
    return (
      <React.Fragment>
        <InfiniteScroll
          dataLength={displayedPosts.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<Loading text={"Loading posts"} />}
          endMessage={<p> Yay! You have seen it all </p>}
        >
          <PostList posts={displayedPosts} />
        </InfiniteScroll>
      </React.Fragment>
    );
  }
}

export default UserPostsInfiniteScroll;
