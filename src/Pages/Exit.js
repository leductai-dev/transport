import React, { Component } from 'react'
import {app} from '../firebaseConfig'
import {UserLogin} from '../Actions/Actions'
import {
    createBrowserHistory,
    createHashHistory,
    createMemoryHistory
  } from 'history'
import {connect} from 'react-redux'

 class Exit extends Component {
    componentDidMount (){
          app.auth().signOut().then(function() {
          console.log("logout thành công")
          localStorage.removeItem('centerID' )
          localStorage.removeItem( 'centerPhone' )
          localStorage.removeItem( 'centerName' )
          localStorage.removeItem( 'centerStatus' )
          localStorage.removeItem( 'centerCity' )
          localStorage.removeItem( 'centerEmail' )
          localStorage.removeItem( 'centerType')
          localStorage.removeItem( 'latitude')
          localStorage.removeItem( 'longitude')
            
        }).catch(function(error) {
          console.log("logout thất bại")

        });
        const history =  createBrowserHistory()
        history.push('./')
        this.logout()
    }

    logout=()=>{
      const centerCity = localStorage.getItem('centerCity')
      const centerID = localStorage.getItem('centerID')
      const centerType = localStorage.getItem('centerType')
     
      const database_getCenterStatus = app.database().ref().child(`SupportCenter/${centerType}/${centerCity}/${centerID}/`)
      database_getCenterStatus.update({
        center_status:"false"
      })
    }
    render() {
        return (
          <h1>NOT FOUND PAGE</h1>
        )
    }
}
const mapStateToProps = (state) => {
  return {
  }
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    
  setUserLogout: (user) => {
    dispatch(UserLogin(user));
},
    
     
  }
} 
export default connect(mapStateToProps,mapDispatchToProps)(Exit)