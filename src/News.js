import React from 'react'
import { fetchMainPosts } from './utils/api'
import { dateConverter } from "./utils/helpers";
import Loading from './Loading'
import { Link } from 'react-router-dom'

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
                 href={story.url ? story.url : "www.google.com"}
               >
                 {story.title}
               </a>
             </h2>
             <div className="meta-info-light">
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
      topStories: null,
      newStories: null,
      storyType: null,
      error: null,
      loading: true,
    };
    
    this.updateStoryType = this.updateStoryType.bind(this);
  }

  componentDidMount() {
    this.updateStoryType(this.props.selectedStoryType)
  }


  updateStoryType(selectedStoryType){
    if(selectedStoryType === 'top' && this.state.topStories === null){
      fetchMainPosts(selectedStoryType)
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
        );
    }

    if (selectedStoryType === "new" && this.state.newStories === null) {
      fetchMainPosts(selectedStoryType)
        .then((posts) =>
          this.setState({
            newStories: posts,
            loading: false,
          })
        )
        .catch(({ message }) =>
          this.setState({
            error: message,
          })
        );
    }
  }


  render() {
    const { topStories, newStories, loading, error } = this.state;
    const { selectedStoryType } = this.props;

    console.log(selectedStoryType)

    if(loading) {
      return <Loading />
    }
    if(error) {
      return <p>ERROR: {error}</p>;
    }

    if(selectedStoryType === 'new'){
      if (newStories !== null){
        return (
          <React.Fragment>
            <StoriesGrid stories={newStories} />
          </React.Fragment>
        );
      } else {
        this.updateStoryType(selectedStoryType);
      }
    }
    if (selectedStoryType === "top") {
      if (topStories !== null) {
        return (
          <React.Fragment>
            <StoriesGrid stories={topStories} />
          </React.Fragment>
        );
      } else {
        this.updateStoryType(selectedStoryType);
        return (
          <React.Fragment>
            <Loading />
          </React.Fragment>
        )
      }
    }

    return (
      <div>
        <h2>NEWSSS</h2>
      </div>
    );
  }
}