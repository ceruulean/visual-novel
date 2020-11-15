import React from 'react';
import Graph from '../scripts/graph'
import Novel from '../scripts/novel'
import vis from 'vis-network'
import Modal from '../components/Modal'

class GraphTest extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      display: "huh",
      }
      this.panel = React.createRef();
    window.demoNovel = new Novel.Novel("Demo Test Novel", "Diana", ["flag1", "flag2"]);

    window.demoNovel.createScene("Scene of Hah","img.jpg", "song.mp4")
    window.demoNovel.createScene("Scene 2","img2.jpg", "song2.mp4")
    window.demoNovel.createScene("Scene Thrice","img3.jpg", "song3.mp4")
    window.demoNovel.createScene("Scene Flour","img4.jpg", "song4.mp4")
    window.demoNovel.createScene("Scene Go","img5.jpg", "song5.mp4")
      window.demoNovel.addEdge(1,3);
      window.demoNovel.addEdge(1,2);
      window.demoNovel.addEdge(1,4, "flag1 == true");
      window.demoNovel.addEdge(3,5);
      window.demoNovel.addEdge(2,5);
      window.demoNovel.addEdge(3,4);
    
     console.log(window.demoNovel);
     console.log(window.demoNovel.connections);
     // console.log(window.demoGraph.allEdges);

  
  }
  
  componentDidMount(){
  
    let visNodes = new vis.DataSet(window.demoNovel.nodes);
  
    // let visNodes = new vis.DataSet([
    //   {id: 0, label: 'Node a'},
    //   {id: 1, label: 'Node b'},
    //   {id: 2, label: 'Node c'},
    //   {id: 3, label: 'Node d'},
    //   {id: 4, label: 'Node z'}
    // ]);
 
  let visedges = new vis.DataSet(window.demoNovel.connections);
 //    console.log(window.demoGraph.allEdges);
 //    let visedges = new vis.DataSet([
 //     {from: 1, to: 3},
 //     {from: 1, to: 2},
 //     {from: 0, to: 4},
 //     {from: 2, to: 0},
 //     {from: 3, to: 3}
 //   ])
 // ;
    
    var container = document.getElementById('container')
    var data = {
      nodes: visNodes,
      edges: visedges
    };
    
    var options = {
     edges: {
       arrows: 'to'
     },
     layout:{
       hierarchical:{
         enabled:true,
         levelSeparation: 150,
         nodeSpacing: 100,
         treeSpacing: 200,
         blockShifting: true,
         edgeMinimization: true,
         parentCentralization: true,
         direction: 'UD',        // UD, DU, LR, RL
         sortMethod: 'directed',  // hubsize, directed
         shakeTowards: 'roots'  // roots, leaves
       },
     }
    };
    let display;
    var network = new vis.Network(container, data, options);
      network.on('click', (e) => {
        console.log(e);
        if (e.nodes.length > 0) {
           let hah = window.demoNovel.nodes.find(node => {return node.id == e.nodes[0]});
           console.log(hah);
          this.setState({
           display: `${hah.label} , ${hah.data.background}`
       })
        }
 
   })
      
  }

  panelToggle(){
    this.panel.current.toggle();
  }

  render() {
    return (
      <div>
        <Modal ref={this.panel}>
          <div>
            {this.state.display}
          </div>
        </Modal>

        <div onClick={this.panelToggle.bind(this)}>click me</div>
      </div>
      
      
      );}

}

export default GraphTest;
