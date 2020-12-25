import React, { Component } from 'react'
import {Set_Page,} from './../Actions/Actions'
import { connect } from 'react-redux'

class Setting extends Component {
  componentDidMount(){
    this.props.setPage(7);
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
        infos: state.centerData
    }
  }
  
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setPage: (page) => {
          dispatch(Set_Page(page));
      },
     
    }
  } 
  export default connect(mapStateToProps,mapDispatchToProps)(Setting)
  




