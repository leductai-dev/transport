import React, { useState, useEffect } from "react";
import Menu from "./Components/menu.js";
import routes from "./Routes";
import Header from "./Components/header.js";
import Request from "./Components/request";
import LoginRegister from "./Pages/Login_Register";
import { useDispatch, useSelector } from "react-redux";
import Main from "./Apps2";
import { app } from "./firebaseConfig";
import { Get_DataUserLogin } from "./Actions/Actions";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home";
import { Redirect } from "react-router-dom";

function App() {
    var [isLogin, setisLogin] = useState(true);

    useEffect(() => {
        let count =  0
        const db_Transactions = app.database().ref().child(`/system/transactions/pending`)
        db_Transactions.on("value", (snap) => {
            if(snap.val()){
                if(count > 0){
                    alert("Count bang 1")
                }else{
                    count++
                }
            }
        });
    }, []);

    // app.auth().onAuthStateChanged(function (user) {
    //     if (user) {
    //         setisLogin(true);
    //         console.log("đã login");
    //     } else {
    //         setisLogin(false);
    //         console.log("chưa login");
    //     }
    // });

    return (
        <Router>
            <div className="row h-100 bg_main ">
                <Menu />
                <div
                    id="tmp_id"
                    className="col-md-10 h-100 customize-layout-right d-flex flex-column"
                >
                    <Redirection />
                </div>
            </div>
            {/* <Request></Request> */}
        </Router>
    );
}
function Redirection() {
    var result = null;
    result = routes.map((route, index) => {
        return (
            <Route
                path={route.path}
                component={route.page}
                key={index}
                exact={route.exact}
            ></Route>
        );
    });
    return <Switch>{result}</Switch>;
}

export default App;
