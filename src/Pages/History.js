import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Set_Page,} from './../Actions/Actions'
import {app} from '../firebaseConfig'
import HistoryItem from '../Components/historyItem'
class History extends Component {
  constructor(props) {
     super(props);
     this.state ={
          dataHistory:{}
     }
  }
  componentDidMount(){
    this.props.setPage(3);
    const database = app.database().ref().child(`InfomationCenter/${localStorage.getItem('centerID')}/history/`)
    database.on('value', (dataSnapshot)=> {
       this.setState({
        dataHistory: dataSnapshot.val()
       })
      })
  }
  showHistory=()=>{
    var result = Object.values(this.state.dataHistory).map((value,index)=>{
      return   <HistoryItem
        date={value.date} key={index} name={value.userName} address={value.userAddress}
      />
    })
    return result
  }
    render() {
      console.log(this.state.dataHistory);
        return (
            <div className="flex-grow-1 map">
            <div className="contain">
              <ul className="nav nav-tabs ul-height" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" data-toggle="tab" href="#home">Latest</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#menu1">Recently</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#menu2">Last Month</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#menu2">Last Year</a>
                </li>
              </ul>
              <div className=" tab-content tab-container">
                <div id="home" className="container tab-pane active">
               {this.showHistory()}
                  
                </div>
                <div id="menu1" className="container tab-pane fade"><br />
                </div>
                <div id="menu2" className="container tab-pane fade"><br />
                 
                </div>
              </div>
            </div>
          </div>
          
        )
    }
}
const mapStateToProps = (state) => {
  return {
      infos: state.centerInfo
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      setPage: (page) => {
        dispatch(Set_Page(page));
    },
     
  }
} 
export default connect(mapStateToProps,mapDispatchToProps)(History)




