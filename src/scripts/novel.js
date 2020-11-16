import {WeightedGraph, Connector, Node, UniqueIDObject} from './graph';
import Evaluator from './evaluator';
import {plainToClass, classToPlain, classToClass} from "class-transformer";


class Path extends Connector {
 constructor(source, target){
  super(source, target);
  this.conditions = [];
 }

 addCondition(){
  //this.conditions = new Evaluator.Condition(conditions);
 }

 get hasConditions(){
  return (this.conditions != null && this.conditions != undefined)
  }
}

// class Effect{
//   constructor(effectObject){
//     this.effects = [];
//     let vars = Object.keys(effectObject);
//     let effects = Object.values(effectObject);
//   }

//   applyTo(variables){
//     let temp = {}
//     Object.assign(temp, variables);

//     return temp
//   }
// }

/**REVIVORSREVIVORSREVIVORSREVIVORSREVIVORSREVIVORSREVIVORSREVIVORSREVIVORS
 

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

 */


/**
 * For the creation and editing of a Visual Novel object
 */

class Novel extends WeightedGraph {
  constructor(title, author, variables){
    super();
    this.title = title;
    this.author = author;
    this.variables = variables? variables: {};
    this.actors = [];

    //A novel always has 1 default character that cannot be deleted or changed.
    this.narrator = new Actor('NARRATOR');
    Object.freeze(this.narrator);

    let c = new Evaluator.Condition("(1 >= 2)");
    console.log(c);
  }

  /**Editable by users of the site/ exposed to creators */
  static WRITABLE_PROPS = ['title','author', 'Actors', 'variables']

  addVariable(keyName, defaultVal) {
    Object.defineProperty(this.variables, keyName, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: defaultVal
    })
  }

  removeVariable(keyname) {
    delete this.variables[keyname];
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

  /**
   * Returns all dialogue objects.
   */
  get dialogues(){

  }

  /**
   * Returns all line objects.
   */
  get lines(){

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

  addActor(Actor) {
    if (Actor instanceof Actor) {
      this.Actors.push(Actor);
      return
    }
    throw new Error("addActor: Must pass Actor object")
  }

  /**
   * @param {String} name required, name of Actor
   * @param {Array} images optional, array of images for various expressions
   */
  createActor(name, images) {
    this.Actors.push(new Actor(name));
  }

  revive(plain){
    let newGraph = plainToClass(Novel, plain);
    this.__reviveAdjList(newGraph, plain);
    //revive object to Actor class
    let charList = newGraph.Actors.map((char)=> {
      return plainToClass(Actor, char);
    })
    newGraph.Actors = charList;
    return newGraph;
  }

}

class Scene extends Node{
  constructor(title){
    super()
    this.title = title;
    this.backgroundURI = null;
    this.musicURI = null;
    this.dialogueTree = null //new DialogueTree(this);
    this.effect = null;
  }

  /**Editable by users of the site/ exposed to creators */
  static WRITABLE_PROPS = ['title','backgroundURI', 'music', 'dialogueTree', 'effect']

  static FLAGS = {
    0:'END'
  }
  setBackground(src){
    this.backgroundURI = src;
  }

  get background(){
    return this.backgroundURI;
  }

  setMusic(src){
    this.musicURI = src;
  }

  get music(){
    return this.musicURI;
  }

  dialogue(ID){
    return this.nodes.find(n => {return n.id === ID}).data;
  }

  createDialogueTree(dialogue){
    this.dialogueTree.addNode(dialogue)
  }

  createDialogue(speaker, mood, text, effect, choices){
    //this.dialogueTree.addNode(speaker, new Dialogue(speaker, mood, text, effect, choices));
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


class Actor extends UniqueIDObject{
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
    super();
    this.name = name;
    this.moods = {};
  }

  changeName(newName){
    this.name = newName
  }

  setMood(mood, imgPath) {
    this.moods[mood] = imgPath;
  }

  setMoods(images){
    for (let i = 0; i < Actor.defaultMoods.length; i++) {
      this.moods[Actor.defaultMoods[i]] = images[i];
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



class NovelReader {
  constructor(novel, saveData){
    this.saveData = saveData;
    this.novel = novel;
    this.sceneIterator = {

      
    }
  }
}

/**
 * Effect is a functional. Example can be an object like
 * {variable: true
 *  variable2: '+= 1',
 * varable3: '=69'}
 */


export default {Novel, Connector}