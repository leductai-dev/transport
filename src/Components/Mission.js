import React, { Component } from 'react'
import {app} from '../firebaseConfig'
import { connect } from 'react-redux'

class request extends Component {
    constructor(props) {
       super(props);
       this.database = app.database().ref().child('Transaction/d3lnDLK3ApV7UJuUZUjXjWy5W742/')

       this.state ={
           show : false 
       }
    }
    componentDidMount(){
        this.database.on('value', (dataSnapshot)=> {
            console.log(dataSnapshot.val());
            if(dataSnapshot.val().user_id)
            {
                this.setState({
                    show : true
                })
            }
            else{
                this.setState({
                    show : false
                })
            }
        })
    }
   
    showRequest =()=>{
        if(this.state.show){
        return (
            <div className="user-request" id="modal">   <i className="fa fa-user-o" aria-hidden="true" />
            <div className="request-modal">
              <div className="modal-top">
                <div className="request-img">
                  <span className=" avar-cs">  <i className="fa fa-user-o avar-cs" aria-hidden="true" /></span>
                </div>
              </div>
              <div className="modal-contain">
                <p className="phone">
                  <span className="float-left ml-4"><img style={{width: '25px'}} src="./png/phone-call.png" alt="" /> Phone number:</span>
                  <span className="ml-2">01232237645</span>
                </p>
                
                <p className="location d-flex flex-row justify-content-around">
                  <span className=" d-flex align-items-center ml-4"><img style={{width: '32px'}} src="./png/placeholder.png" alt="" /> Location:</span>
                  <span className="ml-5 mt-3
                    ">254, Nguyễn Văn Linh, Đà Nẵng</span>
                </p>

              </div>
              <div className="request-button">
                <button type="button" onClick={()=>{this.reject_Request()}} className="btn btn-danger btn-request btn-denied"><img style={{marginLeft: '-5px'}} src="./png/no-entry.png" alt="" /><span className="vertical-text ml-2">REJECT</span></button>
                <button type="button"onClick={()=>{this.accept_Request()}} className="btn btn-success btn-request btn-accept"><img src="./png/yes.png" alt="" /><span className="vertical-text ml-2">ACCEPT</span></button>
              </div>
            </div>
          </div>
        )
    }}

    render() {
       
                return(
                    <>
                    {this.showRequest()}
                    </>
            
        )
    }
}
const mapStateToProps = (state) => {
    return {
        status: state.centerData
    }
  }
  
  
  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      
      
    }
  } 
  export default connect(mapStateToProps,mapDispatchToProps)(request)