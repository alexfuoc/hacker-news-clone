import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import News from "./components/News";
import User from "./components/User";
import Post from "./components/Post";
import Nav from "./components/Nav";
import { ThemeProvider } from "./contexts/theme";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      theme: "light",
      toggleTheme: () => {
        this.setState(({ theme }) => ({
          theme: theme === "light" ? "dark" : "light",
        }));
      },
    };
  }

  render() {
    return (
      <Router>
        <ThemeProvider value={this.state}>
          <div className={this.state.theme}>
            <div className="container">
              <Nav />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => (
                    <News {...props} selectedStoryType={"top"} />
                  )}
                />
                <Route
                  path="/new"
                  render={(props) => (
                    <News {...props} selectedStoryType={"new"} />
                  )}
                />
                <Route path="/post" component={Post} />
                <Route path="/user" component={User} />
                <Route render={() => <h1>404 Not Found</h1>} />
              </Switch>
            </div>
          </div>
        </ThemeProvider>
      </Router>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);