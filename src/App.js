import React, { useState, useEffect } from 'react'
import Menu from './Components/menu.js'
import routes from './Routes'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Button, Box } from 'rebass'
import {useDispatch,useSelector} from 'react-redux'

function App() {
    var [isLogin, setisLogin] = useState(true)
    const state = useSelector((state)=>state.expandMenu)
    // app.auth().onAuthStateChanged(function (user) {
    //     if (user) {
    //         setisLogin(true);
    //         console.log("đã login");
    //     } else {
    //         setisLogin(false);
    //         console.log("chưa login");
    //     }
    // });
    const width = state ? '245px' : '65px'
    return (
        <>
            <Router>
                <div className=" bg_main d-flex ">
                    <Box className="menu_transaction" sx={{
                        width,
                        minWidth: width
                        }}>
                        <Menu />
                    </Box>

                    <Box className="customize-layout-right flex-grow-1">
                        <Redirection />
                    </Box>
                </div>
                {/* <Request></Request> */}
            </Router>
        </>
    )
}
function Redirection() {
    var result = null
    result = routes.map((route, index) => {
        return (
            <Route path={route.path} component={route.page} key={index} exact={route.exact}></Route>
        )
    })
    return <Switch>{result}</Switch>
}

export default App
