import {plainToClass, classToPlain, classToClass} from "class-transformer";

//Abstract class...kinda...
class UniqueIDObject {
  constructor(){

    this.id = UniqueIDObject.generateUID();
        // freeze the id
    Object.defineProperty(this, "id", { configurable: false, writable: false });
  }

  get uid(){
    return this.id;
  }

//**Utility Function from https://stackoverflow.com/questions/3231459/create-unique-id-with-javascript */
 static generateUID() {
  // desired length of Id
  var idStrLen = 16;
  // always start with a letter -- base 36 makes for a nice shortcut
  var idStr = (Math.floor((Math.random() * 25)) + 10).toString(36) + "_";
  // add a timestamp in milliseconds (base 36 again) as the base
  idStr += (new Date()).getTime().toString(36) + "_";
  // similar to above, complete the Id using random, alphanumeric characters
  do {
      idStr += (Math.floor((Math.random() * 35))).toString(36);
  } while (idStr.length < idStrLen);

  return (idStr);
  }

  toJSON(){
    console.log(this);
   // let photo = classToPlain(photo);
  }
}
/**
 * Creates a directed graph
 */
class Graph extends UniqueIDObject {
  constructor(nodesList, connectorsList){
    super();
    this.nodes = [];
    this.adjList = {} // adjacent edges
  }

  addNode(data){
    this.id_counter ++;
    let sss = new Node(data);
    this.nodes.push(sss);
    return sss;
  }

  hasNode(nodeArg){
    //check id
    if (typeof nodeArg === "number" || typeof nodeArg === "string") {
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].id === nodeArg) {
          return true;
        }
      }
      return false;
      //compare object
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


class WeightedGraph extends Graph{
  constructor(){
    super()
    this.root = null;
  }

  setRoot(node) {
    this.root = node;
  }

  updateEdge(from, to, weight){
    this.adjList[from] = this.__generateEdge(from, to, weight);
  }

  __generateEdge(source, target, weight) {
    return new Connector(source, target, weight);
  }

  get connections(){ //for graph display
    return this.edges.map((cnctr)=>{return cnctr.edge})
  }
}

class Node extends UniqueIDObject{
  constructor(data){
    super();
    this.data = data;
   // this.type = (data.constructor.name) || (typeof data);
  }
}


class Connector extends UniqueIDObject{
  constructor(source, target, weight){
    super();
    this.from = source;
    this.to = target;
    this.weight = (weight? weight: 0);
  }

  get edge(){
    return {from: this.from, to: this.to}
  }
}


export {Graph, WeightedGraph, Connector, Node, UniqueIDObject};
