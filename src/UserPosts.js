import React, { Component } from "react";
import { fetchPosts } from "./utils/api";
import Loading from "./Loading";
import dateConverter from "./utils/helpers";

function PostList({ posts }) {
   posts = posts.length > 50 ? posts.slice(0,50) : posts
      //  if (posts !== null) {
      //    console.log("posts during rendered postlist", posts);
      //  } 

   
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

export default UserPosts;