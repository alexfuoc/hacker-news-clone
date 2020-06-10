import React from 'react';
import './App.css';
import News from './News'
import User from './User'
import Post from './Post'
import Nav from './Nav'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


function App() {
  return (
    <Router>
      <div className="container">
        <Nav />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <News {...props} selectedStoryType={"top"} />}
          />
          <Route
            path="/new"
            render={(props) => <News {...props} selectedStoryType={"new"} />}
          />
          <Route
            path='/post'
            component={Post}
          />
          <Route
            path='/user'
            component={User}
          />
          <Route render={() => <h1>404 Not Found</h1>} />
        </Switch> 
      </div>
    </Router>
  );
}

export default App;
