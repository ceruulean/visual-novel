import {WeightedGraph, Connector, Node} from './graph';
import Evaluator from './evaluator';
import {plainToClass, classToPlain, classToClass} from "class-transformer";


class DialogueTree extends WeightedGraph{
  constructor(id){
    this.id = id;
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

/**
 * lines should be an array i think
 */
class Dialogue {
  constructor(id){
    this.id = id;
    this.speaker = null;
    this.mood = null;
    this.lines = null;
    this.choices = null;
    this.effect = null;
  }

  setText(text){
    this.text = text;
  }

  setMood(mood){
    this.mood = mood;
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

  get expression() {
    return this.mood;
  }


  clone(){
    return classToClass(this);
  }
}

 export {Dialogue}