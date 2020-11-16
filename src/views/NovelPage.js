import React from 'react';

class NovelPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      novelName: "Demo Novel",
      }
  }

  render() {
    return (
      <main className="offset">
        <h3>Seriously under construction...</h3>
      </main>
      );
  }
}


export default NovelPage;