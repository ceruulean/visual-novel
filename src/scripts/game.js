import Novel from "novel"
import VC from './conditions';
import {plainToClass, classToPlain} from "class-transformer";


class saveProgressConnector extends Novel.Connector{
  constructor(){
    super()
    this.complete = false;
  }

static createFrom(connector){
  if (connector instanceof Connector) {
    return new saveProgressConnector(connector.source, connector.target, connector.conditions);
  }
}

evaluate(){
  return this.conditions.evaluate();
}

complete(){
  this.completed = true;
}

__uncomplete(){
  this.completed = false;
}

}

class SavePoint{
constructor(currentNodeID, completedEdges){
  this.node = currentNodeID;
  this.completed = completedEdges;
}

get completed(){
  return this.completed;
}

get node(){
  return this.node;
}
}