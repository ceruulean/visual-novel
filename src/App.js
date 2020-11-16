import React from 'react';
import './assets/normalize.css'; 
import './assets/simple-grid.css';// Import regular stylesheet

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import Menu from './components/Menu'
import Scene from './views/Scene';
import NovelPage from './views/NovelPage';
import Creator from './views/Creator';
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
            <Route exact path="/edit">
              <Menu/>
                  <Creator />
            </Route>
            <Route exact path="/">
              <Scene />
            </Route>
            <Route exact path="/novel">
              <Menu/>
                <NovelPage/>
            </Route>
          </Switch>

    </Router>
  );}
}

export default App;
