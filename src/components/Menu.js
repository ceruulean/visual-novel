import React from 'react';
import './Menu.css';
import {
  Link
} from "react-router-dom";

class Menu extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      active: false,
    }

  }

  render() {
    return (
      <nav className="main">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to={`/edit`}>Editor</Link></li>
          <li><Link to={`/novel`}>Novel Page</Link></li>
        </ul>
      </nav>
  );}
}

export default Menu;