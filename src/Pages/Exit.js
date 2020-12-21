import React, { Component } from 'react'
import {app} from '../firebaseConfig'

import {
    createBrowserHistory,
    createHashHistory,
    createMemoryHistory
  } from 'history'
export default class Exit extends Component {
    componentDidMount (){
        const history =  createBrowserHistory()
        history.push('./')
        localStorage.removeItem('user_ID')
        window.location.reload();
        app.auth().signOut().then(function() {
          // Sign-out successful.
        }).catch(function(error) {
          // An error happened.
        });
    }
    render() {
        return (
          <h1>NOT FOUND PAGE</h1>
        )
    }
}
