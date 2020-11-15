class Graph {
  constructor(dataarray){
    this.id_counter = 0;
    this.nodes = [];
    for (let ea in dataarray) {
      this.addNode(`Node ${ea}`, dataarray[ea]);
    }
    this.adjList = {}
  }

  addNode(title, data){
    this.id_counter ++;
    let sss = new Node(this.id_counter, `${title? title : this.id_counter}`, data);
    this.nodes.push(sss);
    return sss;
  }

  hasNode(nodeArg){
    if (typeof nodeArg === "number") {
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i] === nodeArg) {
          return true;
        }
      }
      return false;
    } else if (typeof nodeArg === "object") {
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i] === nodeArg) {
          return i;
        }
      }
      return -1;
    }
  }

  __generateEdge(source, target) {
    return {from: source, to: target}
  }

  addEdge(from, to){
    let index = this.hasNode(to);
    if (index === -1) {
      this.addNode(to);
    }
    let content = this.adjList[from];
    let edgeEntry = this.__generateEdge(from, to);
    if (content === undefined) {
      content = [edgeEntry];
    } else {
      content.push(edgeEntry);
    }

    this.adjList[from] = content;
  }

  removeEdge(from, to) {
    if (typeof from === "object") {
      from = from.id
    }
    if (typeof to === "object") {
      to = to.id
    }
    let content = this.adjList[from];
    if (content === undefined) return false;
    this.adjList[from] = content.filter(edge => {return edge.to != to});
  }

  removeNode(arg){

    let pred;
    if (typeof arg == "number") {
      return this.__removeNode(arg);
    } else if (typeof arg == "object") {
      pred = node => {return node.data === arg}
    } else if (typeof arg == "string") {
      pred = node => {return node.label === arg}
    }

    let foundNode = this.nodes.find(pred)

    if (foundNode === undefined) {
      return undefined
    } else {
      this.__removeNode(foundNode.id);
    }
  }

  __removeNode(nodeID){
    let nodeIndex = -1;
    for (let h = 0; h < this.nodes.length; h++) {
      this.removeEdge(this.nodes[h], nodeID); // remove all edge relations
      if (this.nodes[h].id === nodeID){
          nodeIndex = h;
      }
    }
    this.nodes.splice(nodeIndex, 1);
    delete this.adjList[nodeID];
  }

  outboundEdges(node){
    let targets = this.adjList[node];
    if (targets) {
      return targets.map(edge => {return edge.to});
    }
    return undefined
    
  }

  get edges(){
    let masterList = [];

    Object.values(this.adjList).forEach(node => {
      masterList = [...masterList, ...node];
    })
    return masterList;
  }

  static clone(plain) {
    let clone = new Graph();
    clone.id_counter = plain.id_counter;
    clone.nodes = plain.nodes;
    clone.adjList = plain.adjList;
    return clone;
  }

  bfs(){

  }

  dfs(){

  }
}

class Node{
  constructor(id, label, data){
    this.id = id;
    this.data = data;
    this.label = label;
   // this.type = (data.constructor.name) || (typeof data);
  }
}

export default Graph;
