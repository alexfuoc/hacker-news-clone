import React, { Component } from "react";
import { fetchItem } from "./utils/api";
import Loading from "./Loading";
import { dateConverter, createMarkup }  from "./utils/helpers";
import Comments from './Comments';
import queryString from 'query-string'
import { Link } from 'react-router-dom'


export class Post extends Component {
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

    console.log("Loading Story...", storyId.id);

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
            <a className="link" href={story.url ? story.url : "www.google.com"}>
              {story.title}
            </a>
          </h1>
         {story.text ? 
            (<div
              className="commentText"
              dangerouslySetInnerHTML={createMarkup(story.text)}/> )   : ""}
          <div className="meta-info-light ">
            <span>
              by{" "}
              {
                <Link
                  className=""
                  to={{
                    pathname: "/user",
                    search: `?id=${story.by}`,
                  }}
                >
                  {story.by}
                </Link>
              }{" "}
            </span>
            <span>at {dateConverter(story.time)} </span>
            <span>
              with{" "}
              {
                <Link
                  className=""
                  to={{
                    pathname: "/post",
                    search: `?id=${story.id}`,
                  }}
                >
                  {story.descendants}
                </Link>
              }{" "}
              comments
            </span>
          </div>
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

export default Post;