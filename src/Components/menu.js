import React, { Component } from 'react'
import * as constant from '../Constants/constant'
import {
    Route,
    Link,
  } from "react-router-dom";
const menuLink = [
    {
        "namePage":constant.HomeName,
        "to":"/",
        "exact":true,
        "img":constant.HomeImg
    },
    {
        "namePage":constant.ProfileName,
        "to":"/information",
        "exact":true,
        "img":constant.ProfileImg
    },
    
    {
        "namePage":constant.HistoryName,
        "to":"/transactions",
        "exact":false,
        "img":constant.HistoryImg
    },

    {
        "namePage": constant.ManagerName,
        "to":"/manage-vehicle",
        "exact":false,
        "img":constant.ManagerImg
    },
    {
        "namePage": "Quản lý thành viên",
        "to":"/manage-members",
        "exact":true,
        "img":constant.ManagerImg
    },
    {
        "namePage": constant.DashboardName,
        "to":"/dashboard",
        "exact":false,
        "img":constant.DashboardImg
    },
    {
        "namePage": constant.HelpName,
        "to":"/helps",
        "exact":false,
        "img":constant.HelpImg
    },
    {
        "namePage":constant.SettingName,
        "to":"/settinge",
        "exact":false,
        "img":constant.SettingImg
    },
    {
        "namePage": "Exit",
        "to":"/exit",
        "exact":false,
        "img":"./png/logout.png" 
    },
]
var Menulink =({pageName, to, activeOnlyWhenExact,img} )=>{
    return (
        <Route 
            path = {to}
            exact = {activeOnlyWhenExact}
            children= {({match})=>{
                var active = (match)? "active":" ";
                return (
             
                <li className={`li-item cts-li $(active)`}>
                    <Link to={to} className="a-item" ></Link>
                    <img className="img-history" src={img} alt="icon_link"  />
                    <span className="span-text">{pageName}</span>
                </li>
                

                )
            
            }}
            />
    )}
export default class Menu extends Component {
    render() {
        return (
            <div className="col-md-2 h-100  customize-layout-left d-flex flex-column">
            <div className=" div-logo ">
              <a className="navbar-brand" href="/">
                <img src="/logon.png" alt="logo" className="img_log" />
              </a>
            </div>
            <div className=" flex-grow-1 div-item">
              <ul className="nav navbar-nav h-100 d-flex flex-column align-items-start">
                {this.showMenuLink(menuLink)}
              </ul>
            </div>
          </div>
        )
    }
    showMenuLink(menuLink){
        var result = null;
        if(menuLink.length >0){
            result = menuLink.map((link,index)=>{
                return(
                <Menulink 
                key = {index}
                pageName={link.namePage}
                to ={link.to}
                activeOnlyWhenExact = {link.exact}
                img={link.img}
                ></Menulink>
                )
            })
        }
        return result;
    }


}
