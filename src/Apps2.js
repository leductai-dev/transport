import React, { useEffect } from 'react';
import Menu from './Components/menu.js';
import routes from './Routes'
import Header from './Components/header.js'
import Request from './Components/request'
import LoginRegister from './Pages/Login_Register'
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

export const Component = (props) => {
    return(
        <>
          <div className="row h-100 bg_main ">
        <Menu/>
        <div className="col-md-10 h-100 customize-layout-right d-flex flex-column"> 
        <Header/>
        <Redirection/> 
        </div>
        </div> 
        <Request></Request>
       {/*  <h2>Lalala</h2>
        <Router> 
        <Redirection/> 
      </Router> */}
        </>
    )
}
function Redirection(){
    var result = null;
    result = routes.map((route,index)=>{
      return <Route path={route.path} component={route.page}  key={index} exact = {route.exact}>
        
      </Route>
    });
    return  <Switch>{result}</Switch>;
  }

export default Component