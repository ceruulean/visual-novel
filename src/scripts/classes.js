
class Scene {
  constructor(id) {
    this.id = id;
  }

  addDialogue(dialogue) {
    this.dialogue = [...this.dialogue, ...dialogue];
  }
}

class Dialogue{
  constructor(speaker, expression, lines) {
    this.speaker = speaker;
    this.expression = expression;
    this.lines = lines;
  }

  get lines() {
    return this.lines;
  }

  get speaker() {
    return this.speaker;
  }

  get expression() {
    return this.expression;
  }
}

 export {Character, Dialogue, Scene}