import React, { Component } from 'react'
import { fetchComments } from './utils/api'
import Loading from './Loading'
import './App.css'
import { dateConverter, createMarkup } from './utils/helpers'
import { Link } from 'react-router-dom'


function CommentList({ comments }) {
  comments = comments.length > 50 ? comments.slice(0, 50) : comments;
   if (comments == null) {
     console.log("comments during rendered postlist", comments);
   }

  return (
    <div>
      <div className="commentText">
        {comments.map((comment) => (
          <div key={comment.id} className="shadowing">
            <div className="meta-info-light">
              <span>
                by{" "}
                {
                  <Link
                    className=""
                    to={{
                      pathname: "/user",
                      search: `?id=${comment.by}`,
                    }}
                  >
                    {comment.by}
                  </Link>
                }{" "}
              </span>
              <span> by {comment.by} </span>
              <span>at {dateConverter(comment.time)} </span>
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
   constructor(props){
      super(props)
      this.state = {
         comments: null,
         loading: true,
         error: null
      }
   }

   componentDidMount(){
      const { commentIds } = this.props

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
         )
      
   }

   render() {
      const { comments, error, loading } = this.state

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
      )
   }
}

export default Comments