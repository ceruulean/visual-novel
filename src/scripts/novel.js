import Graph from './graph';
import Condition from './evaluator';
import {plainToClass, classToPlain, classToClass} from "class-transformer";

class WeightedGraph extends Graph{
  constructor(){
    super()
    this.root = null;
  }

  setRoot(node) {
    this.root = node;
  }

  addEdge(from, to, conditions){
    let index = this.hasNode(to);
    if (index === -1) {
      this.addNode(to);
    }
    let content = this.adjList[from];
    let edgeEntry = this.__generateEdge(from, to, conditions);
    if (content === undefined) {
      content = [edgeEntry];
    } else {
      content.push(edgeEntry);
    }

    this.adjList[from] = content;
  }

  updateEdge(from, to, conditions){
    this.adjList[from] = this.__generateEdge(from, to, conditions);
  }

  __generateEdge(source, target, conditions) {
    return new Connector(source, target, conditions);
  }

  get connections(){ //for graph display
    return this.edges.map((cnctr)=>{return cnctr.connectionEdge})
  }

  toJSON(){
    let test = classToPlain(this);
    return test;
  }

  __reviveAdjList(newGraph, plain){
    let keys = Object.keys(plain.adjList);
    //plain object to Connection instance
    let cloneList = {};
    for (let i in keys) {
      cloneList[keys[i]] = plain.adjList[keys[i]].map(edge=>{
        return plainToClass(Connector, edge);
      })
    }
    newGraph.adjList = cloneList;
    return newGraph;
  }

  revive(plain){
    //Change the classType for inheritance
    let newGraph = plainToClass(WeightedGraph, plain);
    this.__reviveAdjList(newGraph, plain);
    return newGraph;
  }

}

class Connector{
  constructor(source, target, conditions){
    this.conditions = new Condition.Condition(conditions);
    this.from = source;
    this.to = target;
  }

  get hasConditions(){
    return (this.conditions != null && this.conditions != undefined)
  }

  get connectionEdge(){
    return {from: this.from, to: this.to}
  }
}
/**
 * For the creation and editing of a Visual Novel object
 */
class Novel extends WeightedGraph {
  constructor(title, author, variables){
    super([]);
    this.title = title;
    this.author = author;
    this.variables = variables;
    this.characters = [];

    let c = new Condition.Condition("(1 >= 2)");
    console.log(c);
  }

  addVariable(keyName) {
    this.variables.push(keyName);
  }

  removeVariable(keyname) {
    this.variables = this.variables.filter(v => {return v != keyname});
  }

  addScene(title, scene){
    this.addNode(title, scene);
  }

  removeScene(arg){
    this.removeNode(arg);
  }

  createScene(label, bgImg, music) {
    let s = new Scene(bgImg, music);
    this.addNode(label, s);
    return s;
  }

  get scenes(){
    return this.nodes;
  }

  scene(ID){
    return this.nodes.find(n => {return n.id === ID}).data;
  }

  addPath(fromID, toID, conditions){
    this.addEdge(fromID, toID, conditions);
  }

  removePath(fromID, toID){
    this.removeEdge(fromID, toID);
  }

  addCharacter(character) {
    if (character instanceof Character) {
      this.characters.push(character);
      return
    }
    throw new Error("addCharacter: Must pass Character object")
  }

  /**
   * @param {String} name required, name of character
   * @param {Array} images optional, array of images for various expressions
   */
  createCharacter(name, images) {
    this.characters.push(new Character(name));
  }

  revive(plain){
    let newGraph = plainToClass(Novel, plain);
    this.__reviveAdjList(newGraph, plain);
    //revive object to Character class
    let charList = newGraph.characters.map((char)=> {
      return plainToClass(Character, char);
    })
    newGraph.characters = charList;
    return newGraph;
  }

}

class Scene{

  constructor(bgImg, music){
    this.background = bgImg;
    this.music = music;
    this.dialogueTree = new DialogueTree(this);
  }

  static FLAGS = {
    0:'END'
  }
  setBackground(src){
    this.background = src;
  }

  setMusic(src){
    this.music = src;
  }

  dialogue(ID){
    return this.nodes.find(n => {return n.id === ID}).data;
  }

  addDialogue(dialogue){
    this.dialogueTree.addNode(dialogue)
  }

  createDialogue(speaker, mood, text, effect, choices){
    this.dialogueTree.addNode(speaker, new Dialogue(speaker, mood, text, effect, choices));
  }

  removeDialogue(dialogue){
    this.dialogueTree.removeNode(dialogue);
  }

  connectDialogue(from, to, conditions){
    this.dialogueTree.addEdge(from, to, conditions);
  }

  disconnectDialogue(from, to) {
      this.dialogueTree.removeEdge(from, to);
  }

  clone(){
    return classToClass(this);
  }
  
}

class DialogueTree extends WeightedGraph{
  constructor(){
    super([]);
  }

  revive(plain){
    let newGraph = plainToClass(DialogueTree, plain);
    this.__reviveAdjList(newGraph, plain);

    //revive node objects to Dialogue class
    let diagList = newGraph.nodes.map((node)=> {
      return {...node, data:plainToClass(Dialogue, node.data)};
    })
    newGraph.nodes = diagList;
    return newGraph;
  }
}

class Dialogue {
  constructor(speaker, mood, text, effect, choices){
    this.speaker = speaker
    this.mood = mood;
    this.text = text;
    this.choices = choices;
    this.effect = effect;
  }

  setText(text){
    this.text = text;
  }

  setMood(mood){
    this.mood = mood;
  }

  get expression() {
    return this.mood;
  }

  addChoice(displayText, toDialogueNodeID){
    this.choices[toDialogueNodeID] = displayText;
  }

  removeChoice(toDialogueNodeID){
    delete this.choices[toDialogueNodeID];
  }

  setEffect(effect){
    this.effect = effect;
  }

  removeEffect(){
    this.effect = [];
  }

  clone(){
    return classToClass(this);
  }
}

class Character{
  static defaultMoods = {
    NEUTRAL: 0,
    HAPPY: 1,
    SAD: 2,
    ANGRY: 3,
    AFRAID: 4,
    CONFUSED: 5,
    SMUG: 6,
    EMBARASSED: 7,
    ECSTATIC: 8,
    DESPAIR: 9,
    BORED: 10
  }
  constructor(name){
    this.name = name;
    this.moods = {}
  }

  changeName(newName){
    this.name = newName
  }

  setMood(mood, imgPath) {
    this.moods[mood] = imgPath;
  }

  setMoods(images){
    for (let i = 0; i < Character.defaultMoods.length; i++) {
      this.moods[Character.defaultMoods[i]] = images[i];
    }
  }

  removeMood(mood) {
    delete this.moods[mood];
  }

  getMoodImage(mood){
    return this.moods[mood];
  }

  clone(){
    return classToClass(this);
  }
}

// class NovelReader {
//   constructor(novelJSON){
//     this.novel = require('./demoNovel.json');
//     this.sceneIterator = {

      
//     }
//   }
// }

export default {Novel, Connector}