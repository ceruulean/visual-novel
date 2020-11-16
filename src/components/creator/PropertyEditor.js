import React from 'react';
import Store from 'store';
import './PropertyEditor.css';

class PropertyEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      json: {
        title:"yeah",
        author:"tittles",
        date_created:"shittles"
      }
    }
  }

  toJSON(){
    return JSON.stringify(this.state.json);
  }

  static HTML_INPUT_TYPES = [
  "button",
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "number",
  "password",
  "radio",
  "range",
  "reset",
  "search",
  "submit",
  "tel",
  "text",
  "time",
  "url",
  "week"]

  render() {
    return (
      <div className="col-3 property-editor-panel">
        <textarea className="pe-json-display" defaultValue={this.toJSON()}>
        </textarea>
      </div>      
    )
  }
}

export default PropertyEditor;