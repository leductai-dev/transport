import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as constant from '../Constants/constant'
/* import { LocalStorage } from "node-localstorage"; */
import {app} from '../firebaseConfig'
 


 class header extends Component {
  constructor(props) {
     super(props);
     this.state ={
          name: localStorage.getItem('centerName'),
          id: localStorage.getItem('centerID'),
          status:""
     }
  }

  componentDidMount(){
   var a= setInterval(()=>{
     const name = localStorage.getItem('centerName')
     const id = localStorage.getItem('centerID')
     const centerCity = localStorage.getItem('centerCity')
     if(id && name &&centerCity){
       clearInterval(a)
       this.getStatus()
       this.setState({
        name: localStorage.getItem('centerName'),
        id: localStorage.getItem('centerID'),
     })
     this.login()
   }},100)

  
}
login=()=>{
  const centerCity = localStorage.getItem('centerCity')
  const centerID = localStorage.getItem('centerID')
  const centerType = localStorage.getItem('centerType')
  const database_getCenterStatus = app.database().ref().child(`SupportCenter/${centerType}/${centerCity}/${centerID}/`)
  database_getCenterStatus.update({
    center_status:"true"
  })
}


  pageName =(page)=>{
    switch (page) {
      case 1:{
        return "Home"
      }
      case 2:{
        return "Profile"
        }
      case 3:{
      return "History"
      }
      case 4:{
        return "Manager Team"
      }
      case 5:{
        return "Dashboard"
      }
      case 6:{
        return "Help"
      }
      case 7:{
        return "Setting"
      }
      default:
        break;
      }
    }
    pageImage =(page)=>{
      switch (page) {
        case 1:{
          return constant.HomeImg
        }
        case 2:{
          return constant.ProfileImg
          }
        case 3:{
        return constant.HistoryImg
        }
        case 4:{
          return constant.ManagerImg
        }
        case 5:{
          return constant.DashboardImg
        }
        case 6:{
          return constant.HelpImg
        }
        case 7:{
          return constant.SettingImg
        }
        default:
          break;
        }
      }
    getStatus =()=>{
      const centerCity = localStorage.getItem('centerCity')
      const centerID = localStorage.getItem('centerID')
      const centerType = localStorage.getItem('centerType')
      const database_getCenterStatus = app.database().ref().child(`SupportCenter/${centerType}/${centerCity}/${centerID}/`)
      database_getCenterStatus.on('value',(datasnapshot)=>{
         this.setState({
          status: datasnapshot.val().center_status
         })
      })
    }

    setStatus =()=>{
      const centerCity = localStorage.getItem('centerCity')
      const centerID = localStorage.getItem('centerID')
      const centerType = localStorage.getItem('centerType')
      const database_getCenterStatus = app.database().ref().child(`SupportCenter/${centerType}/${centerCity}/${centerID}/`)
      database_getCenterStatus.update({
        center_status:this.state.status=="true" ? "false":"true"
      })
    }
    status=()=>{
      if(this.state.status =="true"){
        return <input onClick={()=>{this.setStatus()}} defaultChecked type="checkbox"  />
      }else{
        return  <input onClick={()=>{this.setStatus()}} type="checkbox"  />
      }
    }
    render() {
        return (
       
            <div className="div-head d-flex justify-content-between flex-wrap">
            <div className="div-head-lef p-2">
           
              <h4 style={{color: 'whitesmoke', fontSize: '21px'}}>
              <img className="img-history mr-2" src={`${this.pageImage(this.props.page)}`} alt="icon_link"/>
               {this.pageName(this.props.page)}</h4>
            </div>
            <div className="ml-auto mr-2" style={{marginTop: '9px'}}>
              <label className="switch">
                {this.status()}
                <span className="slider round" />
              </label>
            </div>
            <div className="div-head-right d-flex justify-content-between">
              <img className="img-center" src="./png/avatar_1.jpg" alt="" />
              <div className="well-name">
              <div className="dropdown">
              <button className="btn dr_custome dropdown-toggle" type="button" data-toggle="dropdown">Wellcome
                <span className="caret" /></button>
              <ul className="dropdown-menu">
                <li><a href="#"> Logout</a></li>
                <li><a href="#"> Language</a></li>
                <li><a href="#"> Setting</a></li>
              </ul>
            </div>

                <p className="center-name">{this.state.name}</p>
              </div>
              
            </div>
          </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
      userInfo: state.userLogin,
      // có gì ở đây đâu
      page: state.currentPage
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
     
     
  }
} 
export default connect(mapStateToProps,mapDispatchToProps)(header)