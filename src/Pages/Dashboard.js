import React, { Component } from 'react'
import {Set_Page,} from './../Actions/Actions'
import { connect } from 'react-redux'

class Dashboard extends Component {
  componentDidMount(){
    this.props.setPage(5);
  }
    render() {
        return (
            <div className="flex-grow-1 map">
            <div className="contain maintain">
               
               </div>
          </div>
          
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
  }
  
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setPage: (page) => {
          dispatch(Set_Page(page));
      },
     
    }
  } 
  export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)
  




