import React from "react";
import { fetchMainPosts } from "../utils/api";
import Loading from "./Loading";
import MetaInfo from './MetaInfo';

function StoriesGrid({ stories }) {
  stories = stories.length > 50 ? stories.slice(0, 50) : stories;

  return (
    <div>
      <ul>
        {stories.map((story) => (
          <li key={story.id} className="shadowing">
            <h2 className="header-sm">
              <a
                className="link"
                href={story.url ? story.url : `/post?id=${story.id}`}
              >
                {story.title}
              </a>
            </h2>
            <div className="meta-info-light">
              <MetaInfo user={story.by} time={story.time} id={story.id} comments={story.descendants} />
          </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default class News extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: null,
      error: null,
      loading: true,
    };

    this.updateStoryType = this.updateStoryType.bind(this);
  }

  componentDidMount() {
    this.updateStoryType();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedStoryType !== this.props.selectedStoryType) {
      this.updateStoryType();
    }
  }

  updateStoryType() {
    this.setState({
      loading: true,
      stories: null,
    });

    fetchMainPosts(this.props.selectedStoryType)
      .then((posts) =>
        this.setState({
          stories: posts,
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
    const { stories, loading, error } = this.state;

    if (loading) {
      return <Loading />;
    }
    if (error) {
      return <p>ERROR: {error}</p>;
    }

    return (
      <React.Fragment>
        <StoriesGrid stories={stories} />
      </React.Fragment>
    );
  }
}
