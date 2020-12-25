import React, { useState,useEffect } from 'react';
import Menu from './Components/menu.js';
import routes from './Routes'
import Header from './Components/header.js'
import Request from './Components/request'
import LoginRegister from './Pages/Login_Register'
import { useDispatch, useSelector } from "react-redux";
import Main from './Apps2'
import {app} from './firebaseConfig'
import {Get_DataUserLogin,} from './Actions/Actions'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './Pages/Home';
import { Redirect } from "react-router-dom";
function App() {
  

  var [isLogin, setisLogin] = useState(true)

  useEffect(() => {
    
  }, [])

  app.auth().onAuthStateChanged(function(user) {
    if(user) {
      setisLogin(true)
      console.log("đã login")
    }
    else{
      setisLogin(false)
      console.log("chưa login")
    }}
    )

  
  

return(
  <Router> 
         <Switch>
              <Route path={'/login-register'}  exact = {false}>
              {!isLogin ?  <LoginRegister/> :<Redirect to="/" /> }
              </Route> 
            <Route path={'/'}  exact = {false}>
            {isLogin ? <Main /> :<Redirect to="/login-register" /> }
            </Route>
            </Switch>
</Router>

    );
  }

 /*  <Main />  */

/*   app.auth().onAuthStateChanged(function(user) {
    if(user)
    {
      <Router> 
      <Switch>
         <Route path={'/'}  exact = {false}>
      <Main /> 
         </Route>
       
     </Switch>
   </Router>
    }
    else{
      alert("nope")
  
    }
  })
  )} */

 
/* function Redirection(){
  var result = null;
  result = routes.map((route,index)=>{
    return <Route path={route.path}  key={index} exact = {route.exact}>
      {route.page} 
    </Route>
  });
  return  <Switch>{result}</Switch>;
} */

export default App;
