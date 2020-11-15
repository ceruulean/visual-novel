import React from 'react';
import './Modal.css';

class Modal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      active: false,
    }
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    if (this.props.trigger){
      this.props.trigger.addEventListener('click', this.toggle)
    }
  }

  toggle(){
    if (this.state.active) {
      this.setState({active : false})
    } else {
      this.setState({active : true})
    }
  }

  noClose(e){
    e.stopPropagation();
  }

  close(){
    this.setState({active : false})
  }

  render() {
    return (
    <div className={"modal-dimmer "+(this.state.active?"":"no-display")} onClick={this.close}>
      <div className="modal-window" onClick={this.noClose}>{this.props.children}</div>
    </div>
  );}
}

export default Modal;