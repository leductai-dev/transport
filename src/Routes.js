import React from 'react'
import Home from './Pages/Home.js'
import History from './Pages/Transactions.js'
import ManagerTeam from  './Pages/ManagerTeam.js'
import Information from './Pages/Infomation'
import Dashboard from './Pages/Dashboard'
import Help from './Pages/Help'
import Setting from './Pages/Setting'
import TransactionDetail from './Pages/TransactionDetail'
import Exit from './Pages/Exit'
import NotFoundPage from './Pages/NotFoundPage.js'


const routes = [
    {
        path: '/',
        exact : true,
        page: () => <Home/>
    },
    {
        path: '/information',
        exact : false,
        page: () => <Information/>
    },
    {
        path: '/history',
        exact : false,
        page: () => <History/>
    },
    {
        path: '/manager-team',
        exact : false,
        page: ({history}) => <ManagerTeam/>
    },
    {
        path: '/dashboard',
        exact : false,
        page: () => <Dashboard/>
    },
    {
        path: '/help',
        exact : false,
        page: () => <Help/>
    },
    {
        path: '/setting',
        exact : false,
        page: () => <Setting/>
    },
    {
        path: '/transaction-detail',
        exact : true,
        page: () => <TransactionDetail/>
    },
    {
        path: '/exit',
        exact : false,
        page: () => <Exit/>
    },
    {
        path: '/:slug',
        exact : false,
        page: () => <NotFoundPage/>
    },
   
];

export default routes;
