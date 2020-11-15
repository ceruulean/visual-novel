/**
 * Util for evaluating expressions
 */
function PRECEDENCE(operator) {
  if (operator == "^") {return 3;}
  if (operator == "*" || operator == "/") {return 2;}
  if (operator == "+" || operator == "-") {return 1;}
  if (operator == "(") {return 0;}
  if (operator == ")") {return -1;}
  return -1;
}

class Expression {
  constructor(string) {
    this.set(string);
  }

  static COMPARATORS = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "~": (a) => -1 * a, // this is a unary minus
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": (a, b) => a % b,
    "^": (a, b) => Math.pow(a, b),
    "==": (a, b) => a == b,
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
    ">=": (a, b) => a >= b,
    "<=": (a, b) => a <= b,
    "!=": (a, b) => a != b,
    "||": (a, b) => a || b,
    "&&": (a, b) => a && b,
  };

  // eslint-disable-next-line
  static REGEX = /(\(|\)|\+|\-|\*|\/|\%|\^|!=|==|>=?|<=?|\|\||\&\&)/g;

  _generateQueue(infixExp){
    let q = infixExp.split(Expression.REGEX);
    return q.filter((sweep)=>{ // need to filter out empty array
      return (sweep != "");
    })
  }

  convertToPostfix(infixExp){
    let queue = this._generateQueue(infixExp);
    let output = [];
    let operators = [];
      while (queue.length > 0) {
        let incoming = queue.shift();
        // null string is ignored
        if (!incoming) {
          continue;
        } 

        if ((typeof incoming == 'string') && incoming.match(/\)/)) {
          //closing parenthesis
         while (PRECEDENCE(operators[operators.length - 1]) > 0){
           output.push(operators.pop());
          }
          operators.pop();
        } else if ((typeof incoming == 'string') && incoming.match(/\(/)) {
          //Opening parenthesis
          operators.push(incoming);
        } 
        else if (Expression.isOperator(incoming)) { // is an operator

          while (operators.length > 0 && PRECEDENCE(incoming) <= PRECEDENCE(operators[operators.length - 1]))
          {
            output.push(operators.pop());
          }
          operators.push(incoming);
        }
        else { // Push operand to output
          output.push(incoming);
        }
      }
      while (operators.length > 0) {
          output.push(operators.pop());
      }
      this.value = output;
  }

  convertToInfix(bVerbose) {
    if (!bVerbose) bVerbose = false;
    let verbose = {
      true: (a,o,b) => `(${a} ${o} ${b})`,
      false: (a,o,b) => `${a} ${o} ${b}`
    }
    let output = [];
    let values = [...this.value];
    let q = []
    while (values.length > 0) {
      if (Expression.isOperator(values[0])) {

        let a = q.pop() || output.shift();
        let b = q.pop() || output.shift();


        output.push(verbose[bVerbose](b, values.shift(), a));
      } else {
        q.push(values.shift());
      }
    }
    let derived = output.pop();
    if (!this.infix) {this.infix = derived;}
    return derived;
  }

  set(obj){
    if (typeof obj == "string") {
      this.infix = obj;
      this.convertToPostfix(obj.replace(/\s+/g, ""));
    } else if (Array.isArray(obj)) {
      this.value = obj;
      this.convertToInfix();
    }
  }

  evaluate(){
    let q = [...this.value];
    let f = [];
    while (q.length > 0) {
      if (Expression.isOperator(q[0])){
        let v = f.pop();
        let u = f.pop();
        f.push(Expression.COMPARATORS[q[0]](u, v));
        q.shift();
      } else {
        f.push(q.shift());
      }
    }
    return f[0];
  }

  static isParenthesis(ch){
    if (ch.match(/\(|\)/)) return true
    return false;
  }

  static isOperator(ch){
    if (typeof ch != "string") {return false}
    if (ch.match(Expression.REGEX)) {
      return true
    }
    return false;
  }
}

class MathExpression extends Expression {
  /**Add a number verification */
  _generateQueue(infixExp){
    let q = infixExp.split(Expression.REGEX);

    q = q.filter((sweep)=>{
      return (sweep != "");
    })

    q = this._unaryConvert(q);

      return q.map((ele)=>{
        let n = Number(ele);
        if (isNaN(n)) {
          return ele;
        }
        return n;
      })
  }
/**
 * To detect unary minus signs
 */
  _unaryConvert(queue){
    let q = [...queue];
    let pointer = 0;
    console.log(q);
    while (pointer < q.length){
      if (q[pointer] == '-'){
        console.log(q[pointer]);
        if (PRECEDENCE(q[pointer - 1]) > -1){ // Greater than -1 means it's operator or open paranthesis '('
          q.splice(pointer, 1, -1); // replace unary with -1
          q.splice(pointer+1, 0, "*"); //add multiplication operator
          console.log(q);
        }
      }
      pointer++;
    }
    return q;
  }
}

/*
* Makes it easier to evaluate conditions.
* new Condition(arg) : argument accepts infix string or an array
*/
class Condition extends MathExpression {

  static COMPARATORS = {
    "==": (a, b) => a == b,
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
    ">=": (a, b) => a >= b,
    "<=": (a, b) => a <= b,
    "!=": (a, b) => a != b,
    "||": (a, b) => a || b,
    "&&": (a, b) => a && b,
  };

  // eslint-disable-next-line
  static REGEX = /(\(|\)|!=|==|>=?|<=?|\|\||\&\&)/g;

}

export default {Condition};