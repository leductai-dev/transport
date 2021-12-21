import React, { Component, useEffect } from 'react'
import * as constant from '../Constants/constant'
import { Route, Link } from 'react-router-dom'
import { useHistory, withRouter } from 'react-router'
import addNotification, { Notifications } from 'react-push-notification'
import { app } from '../firebaseConfig'
import { Button } from 'rebass'
import { useDispatch, useSelector } from 'react-redux'
import { expand } from '../Actions/Action_transactions'

const menuLink = [
    {
        namePage: constant.HomeName,
        to: '/',
        exact: true,
        img: constant.HomeImg,
    },
    {
        namePage: constant.ProfileName,
        to: '/information',
        exact: true,
        img: constant.ProfileImg,
    },

    {
        namePage: constant.HistoryName,
        to: '/transactions',
        exact: false,
        img: constant.HistoryImg,
    },

    {
        namePage: constant.ManagerName,
        to: '/manage-vehicle',
        exact: false,
        img: constant.VehicleImg,
    },
    {
        namePage: 'Quản lý thành viên',
        to: '/manage-members',
        exact: true,
        img: constant.ManagerImg,
    },
    {
        namePage: constant.DashboardName,
        to: '/dashboard',
        exact: false,
        img: constant.DashboardImg,
    },
    {
        namePage: constant.HelpName,
        to: '/helps',
        exact: false,
        img: constant.HelpImg,
    },
    {
        namePage: constant.SettingName,
        to: '/settinge',
        exact: false,
        img: constant.SettingImg,
    },
    {
        namePage: 'Mở rộng/Thu gọn',
        to: '/exit',
        exact: false,
        img: '/png/logout.png',
    },
]
var Menulink = ({ pageName, to, activeOnlyWhenExact, img, isLast }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const state = useSelector((state) => state.expandMenu)

    return (
        <Route
            path={to}
            exact={activeOnlyWhenExact}
            children={({ match }) => {
                var active = match ? 'active' : ' '
                if (isLast) {
                    return (
                        <li className={`li-item cts-li $(active)`}>
                            <Link
                                onClick={() => {
                                    dispatch(expand())
                                }}
                                className="a-item"
                            ></Link>
                            <img className="img-history" src={img} alt="icon_link" />
                            {state && <span className="span-text">{pageName}</span>}
                        </li>
                    )
                }
                return (
                    <li className={`li-item cts-li `}>
                        <Link to={to} className="a-item"></Link>
                        <img className="img-history" src={img} alt="icon_link" />
                        {state && <span className="span-text">{pageName}</span>}
                    </li>
                )
            }}
        />
    )
}

function Menu() {
    const history = useHistory()
    const db_Transactions = app.database().ref().child(`/transactions`)

    const state = useSelector((state) => state.expandMenu)

    useEffect(() => {
        let isCan = false
        db_Transactions.on('child_added', (snap) => {
            if (isCan && snap.val()) {
                const db_Customer = app
                    .database()
                    .ref()
                    .child(`/customers/${snap.val().customerId}`)
                db_Customer.once('value', (snap2) => {
                    addNotification({
                        title: 'Yêu cầu vận chuyển!',
                        subtitle: 'subtietlee',
                        message: `Yêu cầu vận chuyển mới từ ${snap2.val().name}`,
                        onClick: (e) => {
                            window.focus()
                            history.push(`/transaction/${snap.val().transactionId}`)
                        },
                        theme: 'red',
                        duration: 10000,
                        backgroundTop: 'green',
                        backgroundBottom: 'darkgreen',
                        colorTop: 'green',
                        colorBottom: 'darkgreen', //optional, font color of bottom container.
                        closeButton: 'Go away', //optional, text or html/jsx element for close text. Default: Close,
                        native: true, //optional, makes the push notification a native OS notification
                        icon: 'string', // optional, Native only. Sets an icon for the notification.
                        vibrate: 1, // optional, Native only. Sets a vibration for the notification.
                        silent: false, // optional, Native only. Makes the notification silent.
                    })
                })
            } else {
                setTimeout(() => {
                    isCan = true
                }, 2000)
            }
        })
    }, [])

    return (
        <>
            <Notifications />
            <div
                style={{ minWidth: '245px' }}
                className="h-100  customize-layout-left d-flex flex-column"
            >
                <div className=" div-logo " style={{ minHeight: '100px' }}>
                    <a className="navbar-brand" href="/">
                        {state ? (
                            <img src="/logon.png" alt="logo" className="img_log " />
                        ) : (
                            <img
                                src="/png/userLocation.png"
                                width="40px"
                                style={{ width: '40px', marginTop: '10px', marginLeft: '6px' }}
                                alt="logo"
                                className="img_log"
                            />
                        )}
                    </a>
                </div>
                <div className=" flex-grow-1 div-item">
                    <ul className="nav navbar-nav h-100 d-flex flex-column align-items-start">
                        {showMenuLink(menuLink)}
                    </ul>
                </div>
            </div>
        </>
    )

    function showMenuLink(menuLink) {
        var result = null
        if (menuLink.length > 0) {
            result = menuLink.map((link, index) => {
                return (
                    <Menulink
                        key={index}
                        pageName={link.namePage}
                        to={link.to}
                        activeOnlyWhenExact={link.exact}
                        img={link.img}
                        isLast={menuLink.length - 1 === index ? true : false}
                    ></Menulink>
                )
            })
        }
        return result
    }
}
export default withRouter(Menu)
