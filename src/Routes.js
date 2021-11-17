import React from 'react'
import Home from './Pages/Home.js'
import Transactions from './Pages/Transactions.js'
import ManageVehicle from  './Pages/ManageVehicle.js'
import Information from './Pages/Infomation'
import Dashboard from './Pages/Dashboard'
import Help from './Pages/Help'
import Setting from './Pages/Setting'
import TransactionDetail from './Pages/TransactionDetail'
import AddVehicle from './Pages/AddVehicle'
import Exit from './Pages/Exit'
import NotFoundPage from './Pages/NotFoundPage.js'
import ManageMember from './Pages/ManageMember'

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
        path: '/transactions',
        exact : true,
        page: () => <Transactions/>
    },
    {
        path: '/manage-vehicle',
        exact : false,
        page: ({history}) => <ManageVehicle/>
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
        path: '/transaction/:id',
        exact : true,
        page: () => <TransactionDetail/>
    },
    {
        path: '/vehicle/add-new',
        exact : true,
        page: () => <AddVehicle/>
    },
    {
        path: '/manage-members',
        exact : true,
        page: () => <ManageMember/>
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
