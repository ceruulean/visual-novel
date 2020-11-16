import React from 'react';
import Graph from '../scripts/graph'
import Novel from '../scripts/novel'
import PropertyEditor from '../components/creator/PropertyEditor';
import NewItemEditor from '../components/creator/NewItem';
import Modal from '../components/Modal'

class Creator extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
      }
    
    this.newItemModal = React.createRef();
  }

  componentDidMount(){

       
  }

  newNovel(){
    this.newItemModal.current.toggle();
  }


  render() {
    return (
      <main className="container creator-top-wrapper offset">
        <div class="row">
          <section class="col-9 creator-workspace">
            <button onClick={this.newNovel.bind(this)}>+ New Novel</button>
            <button>Edit Novel</button>
          </section>
          <PropertyEditor/>
        </div>
        <Modal ref={this.newItemModal}>
          <NewItemEditor itemName="novel"/>
        </Modal>
      </main>  
      );}

}

export default Creator;
