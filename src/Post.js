import React, { Component } from "react";
import { fetchItem, fetchComments } from "./utils/api";
import Loading from "./Loading";
import { createMarkup }  from "./utils/helpers";
import queryString from 'query-string'
import MetaInfo from "./MetaInfo";


function CommentList({ comments }) {
  comments = comments.length > 50 ? comments.slice(0, 50) : comments;
  if (comments == null) {
    console.log("comments during rendered postlist", comments);
  }

  return (
    <div>
      <div className="commentText">
        {comments.map((comment) => (
          <div key={comment.id} className="shadowing comment-bg">
            <div className="meta-info-light">
              <MetaInfo user={comment.by} time={comment.time} />
            </div>
            <div
              className="commentText"
              dangerouslySetInnerHTML={createMarkup(comment.text)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const { commentIds } = this.props;

    fetchComments(commentIds)
      .then((comments) =>
        this.setState({
          comments,
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
    const { comments, error, loading } = this.state;

    if (error) {
      return <p>{error}</p>;
    }

    if (loading) {
      return <Loading text={"Fetching Comments"} />;
    }

    return (
      <div>
        <CommentList comments={comments} />
      </div>
    );
  }
}

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      story: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const storyId  = queryString.parse(this.props.location.search);

    fetchItem(storyId.id)
      .then((story) =>
        this.setState({
          story,
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
    const { story, error, loading } = this.state;

    if (error) {
      return <p>{error}</p>;
    }

    if (loading) {
      return <Loading text={"Fetching Post"} />;
    }

    console.log(story);

    return (
      <React.Fragment>
        <div>
          <h1 className="header-lg link">
            <a
              className="link"
              href={story.url ? story.url : `/post?id=${story.id}`}
            >
              {story.title}
            </a>
          </h1>
          <div className="meta-info-light">
            <MetaInfo user={story.by} time={story.time} id={story.id} comments={story.descendants} />
          </div>
          {story.text ? (
            <div
              className="commentText"
              dangerouslySetInnerHTML={createMarkup(story.text)}
            />
          ) : (
            ""
          )}
        </div>
        {story.descendants === 0 ? (
          <p>No comments</p>
        ) : (
          <Comments commentIds={story.kids} />
        )}
      </React.Fragment>
    );
  }
}