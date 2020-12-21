import React, { useEffect } from 'react';
import Menu from './Components/menu.js';
import routes from './Routes'
import Header from './Components/header.js'
import Request from './Components/request'
import LoginRegister from './Pages/Login_Register'
import { useDispatch, useSelector } from "react-redux";
import Main from './Apps2'


import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './Pages/Home';
import { Redirect } from "react-router-dom";
function App() {
  
/*   const { count, user } = useSelector(state => ({
    count: state.counter.count,
    user: state.user,
  })); */


  const userToken2 = useSelector(state => state.user.user_ID);
  console.log(userToken2);
  const userToken = localStorage.getItem('user_ID')
  if(userToken){
    return (  
      <Router> 
         <Switch>
            <Route path={'/'}  exact = {false}>
            {userToken ? <Main /> :<Redirect to="/login-register" /> }
            </Route>
            <Route path={'/login-register'}  exact = {false}>
               <LoginRegister/>
            </Route>
        </Switch>


      {/*   <div className="row h-100 bg_main ">
        <Menu/>
        <div className="col-md-10 h-100 customize-layout-right d-flex flex-column"> 
        <Header/>
        <Redirection/> 
        </div>
        </div> 
        <Request></Request> */}
      </Router>
    );
  }
  else{
    return(
      <Router>
      <LoginRegister/>
      </Router>
    )
  }
 
}
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
