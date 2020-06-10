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
      error: null,
      loading: true,
    };
  }

  componentDidMount() {
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
      )
  }


  render() {
    const { stories, loading, error } = this.state;
    if(loading) {
      return <Loading />
    }
    if(error) {
      return <p>ERROR: {error}</p>;
    }

    if (stories !== null) {
      console.log(stories);
      return (
        <div>
          <StoriesGrid stories={stories} />
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