import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import Scene from './views/Scene';
import NovelPage from './views/NovelPage';
import GraphTest from './views/GraphTest';
import Store from 'store';
import './App.css';

class App extends React.Component {
  constructor(){
    super();
    this.state = {

    }
  }



  render() {
    return (
      <Router>
        <Switch>
          <Route path="/edit">
          <div id="container">
            <GraphTest />
          </div>
          </Route>
          <Route exact path="/">
            <Scene />
          </Route>
          <Route exact path="/novel" component={NovelPage} />
        </Switch>
    </Router>
  );}
}

export default App;
