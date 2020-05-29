import React from 'react'
import { fetchMainPosts } from './utils/api'
import dateConverter from "./utils/helpers";
import Loading from './Loading'

function StoriesGrid({ stories }) {
  stories = stories.length > 50 ? stories.slice(0, 50) : stories;

   return (
     <div>
       <ul>
         {stories.map((story) => (
            <li key={story.id}>
               <a href={story.url ? story.url : 'www.google.com'}>{story.title}</a>
               <span> by {story.by} </span>
               <span>at {dateConverter(story.time)} </span>
               <span>with {story.descendants} comments</span>
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
      selectedStoryType: "top",
      topStories: null,
      newStories: null,
      error: null,
      loading: true,
    };
  }

  componentDidMount() {
    fetchMainPosts(this.state.selectedStoryType)
      .then((posts) =>
        this.setState({
          topStories: posts,
          loading: false,
        })
      )
      .catch(({ message }) =>
        this.setState({
          error: message,
        })
      )
  }

  render() {
    const { topStories, loading, error } = this.state;
    if(loading) {
      return <Loading />
    }
    if(error) {
      return <p>ERROR: {error}</p>;
    }

    if (topStories !== null) {
      console.log(topStories);
      return (
        <div>
          <StoriesGrid stories={topStories} />
        </div>
      );
    }

    return (
      <div>
        <h2>NEWSSS</h2>
      </div>
    );
  }
}