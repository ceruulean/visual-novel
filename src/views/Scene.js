import React from 'react';
import './Scene.css';
import Modal from '../components/Modal';
import Store from 'store';
import Evaluator from '../scripts/evaluator'

class Scene extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lineComplete: false,
      reset: false,
      lineTextDisplay: "",
      typewriterSpeed: 40,
      currentSpeakerName: "Name",
      volume: 100,
      novel: require('./demoNovel.json'),
      currentPoint: {
        scene: 0,
        dialogue: 0,
        line: 0
      }
    }
    
    this.settings = React.createRef();
    this.scene = React.createRef();
    this.choiceHandler.bind(this);
    this.completeLine.bind(this);
    this.newLine.bind(this);
    this.typewriterReset.bind(this);
  }

  componentDidMount() {
    let a = this.navigationHandler.bind(this);
    window.addEventListener('keydown', a);
    document.getElementById("conversation-area").addEventListener('click', a);
    this.typeWriter();
   // console.log(this.state.novel);
    this.setState({currentVariables: this.state.novel.variables});
    this.init();
  }

  init(){
    Store.set("variables", this.state.novel.variables);
  }

  save(){
    let obj = {
      title: this.state.novel.title,
      savePoint: this.state.currentPoint,
      variables: Store.get("variables")
    }

    Store.set(obj.title, obj);
  }

  loadSave(){
    let test = Store.get(this.state.novel.title);
    console.log(test);
    Store.set("variables", test.variables);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.navigationHandler);
    document.getElementById("conversation-area").removeEventListener('click', this.navigationHandler);

  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.currentPoint !== prevState.currentPoint) {
      this.typeWriter();
    }
 }

  getBackground(){
    return this.getCurrentScene().background;
  }

  getCurrentSpeakerID() {
    return this.getCurrentDialogue().speaker_id;
  }

  getChoices(){
    return this.getCurrentDialogue().choices;
  }

  dialogueCondition(){
    console.log(this.state.novel.variables);
  }

  completeLine(){
    this.setState({lineTextDisplay: this.getCurrentText(), lineComplete: true, reset:false});
  }

  newLine(){
    this.setState({
      lineTextDisplay: "",
      lineComplete: false,
      reset:false
    });
  }

  typewriterReset(){
    this.setState({reset:true});
  }
  
  typeWriter(text) {
    if (!text) {
      text = this.getCurrentText();
    }
    this.newLine();
    
    let pointer = 0;
    let o = (txt, point) => {
      if (this.state.lineComplete){
        return;
      }
      if (txt.length === point || this.props.typewriterSpeed === 0) {
        this.setState({lineTextDisplay: txt, lineComplete: true});
        return;
      }
      this.setState({lineTextDisplay: txt.substring(0, point)});
      setTimeout(()=> o(txt, point+1), this.state.typewriterSpeed);
    }
    o(text,pointer);
  }

  navigationHandler(e){

    if (this.state.lineComplete){
      if (e.type === "keydown"){
        if (e.keyCode === 32 || e.keyCode === 39) { //spacebar or right arrow>>>
          // required choice, so cannot proceed with next like normal
          if (this.getChoices() !== null && this.getChoices() !== undefined) {
            return
          }
          this.next();
        } else if (e.keyCode === 37) { //left arrow<<<
          this.previous();
          return
        }
      }
    } else {
      this.completeLine();
    }
  }

  getCurrentScene(){
    return this.state.novel.scenes[this.state.currentPoint.scene];
  }
  getCurrentDialogue(){
    return this.getCurrentScene().dialogues[this.state.currentPoint.dialogue];
  }
  getCurrentLine(){
    return this.getCurrentDialogue().lines[this.state.currentPoint.line];
  }
  getCurrentText(){
    return this.getCurrentDialogue().lines[this.state.currentPoint.line].text;
  }

  choiceHandler(e){
    let choice = this.getChoices()[e.target.tabIndex];
    //this.choiceEvent(e.target.tabIndex, choice.effect)
    this.evalEffect(choice.effect);
    this.next();
  }

  /**
   * effectObj should look like {variable:value}, and set the save file variable to specified value
  */
  evalEffect(effectsObj){
    if (!effectsObj) {return}
    let newVars = Object.assign({...Store.get("variables")}, effectsObj);
    Store.set("variables", newVars);
  }

  /**
   *  You can have a "condition" property on the scene, dialogue or line
   * @param {*} condition a postfix array
   */
  evalCondition(condition) {

    if (condition === null || condition === undefined || condition.length === 0){return true}

      let vars = Store.get("variables");
      // object structure:
      // {
      //   "narratorHappiness" : 0,
      //   "triggeredChoiceA" : false,
      //   "triggeredChoiceB" : false
      // }
      let replacedRef = condition.map(obj => vars[obj] || obj);
      console.log(replacedRef);
      let cond = new Evaluator.Condition(replacedRef);
      console.log(cond);
      console.log(cond.evaluate());
      //return cond.evaluate();
      return false;
  }

  /** Checks if array out of bounds. maxIndex is inclusive. propertyName must be "scene","dialogue" or "line"*/
  _getNextIndexOf(object){
    let savepoint = this.state.currentPoint;
    return function(propertyName){
      let currentPoint = savepoint[propertyName];
      let maxIndex = object.length - 1;
      let n = currentPoint + 1;
      if (n > maxIndex) {
        return null
      }
      return n;
    }
  }

  //these functions will return the index of the Next Object, or null if it's the end.
  getNextIndex(property){
    let context = this;
    let fragment = {
      scene : context.state.novel.scenes,
      dialogue: context.getCurrentScene().dialogues,
      line: context.getCurrentDialogue().lines
    }
    return this._getNextIndexOf(fragment[property])(property);
  }
  getNextSceneIndex(){
    return this._getNextIndexOf(this.state.novel.scenes)('scene');
  }
  getNextDialogueIndex(){
    return this._getNextIndexOf(this.getCurrentScene().dialogues)('dialogue');
  }
  getNextLineIndex(){
    return this._getNextIndexOf(this.getCurrentDialogue().lines)('line');
  }

  hasChoices(){
    let c = this.getChoices();
    return (c !== null && c !== undefined);
  }
/*
Returns the next object if there's a next, otherwise returns false
*/
  hasNext() {
    //don't let the next display if there's (mandatory) choices to make
    if (this.hasChoices()) {return false;}
    let check = this.getNextLineIndex() || this.getNextDialogueIndex() || this.getNextSceneIndex();
    if (check) {return check;} else {return false;}
  }

  next() {

    //savePoint is the object {dialogue: INDEX, line: INDEX,scene: INDEX}
    let newSavePoint = Object.assign({}, this.state.currentPoint);
      let n = this.getNextLineIndex();

      let assignNext = (property) => {
        newSavePoint[property] = n;
      }
      
      //Evaluate conditions

      let context = this;
      let evalCondNext = (property) => {
        let fragment = {
          scene : context.state.novel.scenes[newSavePoint.scene],
          dialogue: context.state.novel.scenes[newSavePoint.scene].dialogues[newSavePoint.dialogue],
          line: context.state.novel.scenes[newSavePoint.scene].dialogues[newSavePoint.dialogue].lines[newSavePoint.line]
        }
        return context.evalCondition(fragment[property].condition);
      }
      
      if (n) {
        assignNext('line');
      } else {
        n = 0;
        assignNext('line');
        n = this.getNextDialogueIndex();
        if (n) {
          assignNext('dialogue');
        } else {
          n = 0;
          assignNext('dialogue');
          n = this.getNextSceneIndex();
          if (n) {
            assignNext('scene');
          } else {
            n = 0;
            console.log('End of novel detected.');
            return;
            //assignNext('scene');
          }
        }
      }

    this.setState({currentPoint: newSavePoint});

    // Evaluate new effects
    this.evalEffect(this.getCurrentScene().effect);
    this.evalEffect(this.getCurrentDialogue().effect);
    this.evalEffect(this.getCurrentLine().effect);

    //show
    this.typeWriter();
  }

  hasPrevious() {

    if (this.state.currentPoint.line > 0) {
      return true;
    } else {
     if (this.state.currentPoint.dialogue > 0) {
       let c = this.getCurrentScene().dialogues[this.state.currentPoint.dialogue - 1].choices;
       if (c !== null && c !== undefined) { // the previous dialogue had choices
        return false;
       }
      return true;
     } else {
      if (this.state.currentPoint.scene > 0) {
        return true;
      } else {
        return false;
      }
     }
    }
  }

  previous(){
    this.completeLine();
    let obj = Object.assign({}, this.state.currentPoint);
    if (this.state.currentPoint.line > 0) {
      obj.line -= 1;
    } else {
     if (this.state.currentPoint.dialogue > 0) {
      obj.dialogue -= 1;
      obj.line = (this.getCurrentScene().dialogues[obj.dialogue].lines.length - 1);
     } else {
      if (this.state.currentPoint.scene > 0) {
        obj.scene -= 1;
        obj.dialogue = this.state.novel.scenes[obj.scene].dialogues.length - 1;
        obj.line = (this.state.novel.scenes[obj.scene].dialogues[obj.dialogue].lines.length - 1);
      }
     }
    }
    this.setState({currentPoint: obj});
    this.typeWriter();
  }
  
  handleSliderChange(e){
    //
    this.setState({typewriterSpeed: (100 - e.target.value)})
  }

  settingsToggle(){
      this.settings.current.toggle();
  }

  render() {
    var hasChoices = (this.hasChoices());
    let choices;
    if (hasChoices) {
      choices =  <ul>
        {this.getChoices().map((choice, index) => (<li key={index}
        onClick={(e) => this.choiceHandler(e)}
        tabIndex={index}
        >{choice.text}</li>))}
      </ul>;
    }

    return (
      <div>
      <svg id="settingsCog" xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1792 1792"
onClick={this.settingsToggle.bind(this)}>
<path d="M1145.492 645.424q0-106-75-181t-181-75q-106 0-181 75t-75 181q0 106 75 181t181 75q106 0 181-75t75-181zm512-109v222q0 12-8 23t-20 13l-185 28q-19 54-39 91 35 50 107 138 10 12 10 25t-9 23q-27 37-99 108t-94 71q-12 0-26-9l-138-108q-44 23-91 38-16 136-29 186-7 28-36 28h-222q-14 0-24.5-8.5t-11.5-21.5l-28-184q-49-16-90-37l-141 107q-10 9-25 9-14 0-25-11-126-114-165-168-7-10-7-23 0-12 8-23 15-21 51-66.5t54-70.5q-27-50-41-99l-183-27q-13-2-21-12.5t-8-23.5v-222q0-12 8-23t19-13l186-28q14-46 39-92-40-57-107-138-10-12-10-24 0-10 9-23 26-36 98.5-107.5t94.5-71.5q13 0 26 10l138 107q44-23 91-38 16-136 29-186 7-28 36-28h222q14 0 24.5 8.5t11.5 21.5l28 184q49 16 90 37l142-107q9-9 24-9 13 0 25 10 129 119 165 170 7 8 7 22 0 12-8 23-15 21-51 66.5t-54 70.5q26 50 41 98l183 28q13 2 21 12.5t8 23.5z"
/></svg>

<div id="background" style={{backgroundImage:`url(`+this.getBackground()+`)`}}>

<div id="conversation-area">
<div id="speaker" className="right">SpeakerID: {this.getCurrentSpeakerID()}</div>
<div className="conversation">
  <span id="line-area" className={this.state.reset?"no-display":""}>{this.state.lineTextDisplay}</span>
  <span className={(hasChoices && this.state.lineComplete ?"":"hidden")}>
    {choices}
  </span>
</div>
<div className="buttons">
<button id="prev" className={this.state.lineComplete && this.hasPrevious()? "" : "hidden"}
onClick={this.previous.bind(this)}>Previous</button>
<button id="next"
className={this.state.lineComplete && this.hasNext() && !hasChoices? "" : "hidden"}
onClick={this.next.bind(this)}>Next</button>
</div>

</div>


</div>

      <Modal ref={this.settings}>
        <div className="settings">
          <div className="col">
            <h2>Game</h2>
            <div className="option">
            Load new game from file?
            </div>
          </div>
          <div className="col">
            <h2>Settings</h2>
            <div className="option"><h3>Text Speed</h3>
              <input type="range"
              name="typewriterSpeed"
              min="0" max="100" step="20"
              defaultValue={100 - this.state.typewriterSpeed}
              className="slider"
              onChange={this.handleSliderChange.bind(this)}></input>
                <div className="sliderLabel"><span style={{float:'right'}}>Instant</span><span style={{float:'left'}}>Slow</span></div>
            </div>
            <div className="option"><h3>Audio Volume</h3>
              <input type="range"
              name="volume"
              min="0" max="100"
              defaultValue={this.state.volume}
              className="slider"
              ></input>
                <div className="sliderLabel"><span style={{float:'left'}}>Mute</span><span style={{float:'right'}}>Loud</span></div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );}
}

export default Scene;