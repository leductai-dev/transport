import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as constant from '../Constants/constant'
/* import { LocalStorage } from "node-localstorage"; */
 


 class header extends Component {
 
  componentDidMount(){
    /* global.localStorage = new LocalStorage('./scratch');
    console.log("Component Header Loaded");
    console.log(localStorage.getItem('myFirstKey')); */
    console.log();
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
                <input type="checkbox" defaultChecked />
                <span className="slider round" />
              </label>
            </div>
            <div className="div-head-right d-flex justify-content-between">
              <img className="img-center" src="./png/avatar.jpg" alt="" />
              <div className="well-name">
                <p className="wellcome d-flex">
                  <span>Wellcome</span>
                  <i className="fa fa-sort-desc btn-option " aria-hidden="true" /></p>
                <p className="center-name">Công an Quận Thanh Khê</p>
              </div>
            </div>
          </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return {
      page: state.currentPage
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
     
     
  }
} 
export default connect(mapStateToProps,mapDispatchToProps)(header)