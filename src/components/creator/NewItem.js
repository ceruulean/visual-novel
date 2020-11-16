import React from 'react';
//import './PropertyEditor.css';

class NewItemEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      fields: {
      }
    }
  }

  handleChange(fieldProp){
    let fn = (e) => {
      let o = {};
      o[fieldProp] = e.target.value;
  
      o = Object.assign(this.state.fields, o);
      this.setState({fields: o});
    }
    return function(event) {
      fn(event);
      ;}
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  createSubmit(event){
    event.preventDefault();
    console.log(this.state.fields);
  }


  render() {
    let y;
    let ok = (fieldProp) => {
      let stateField = this.state.fields[fieldProp];
      return (
    <label for={fieldProp}>{fieldProp}<input value={stateField} name={fieldProp} onChange={this.handleChange(fieldProp)} /></label>
    )}

    if(this.props.itemName === 'novel'){
      //novel generation code

      y = ['title', 'author'];

    }
    return (
      <div className="">
        <h1>Create new {this.props.itemName}</h1>
        <p>Instructions coming soon</p>
        {y.map(x=> ok(x))}

        <button onClick={this.createSubmit.bind(this)}>Create</button>
      </div>
    )
  }
}

export default NewItemEditor;