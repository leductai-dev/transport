import React from 'react'
import Home from './Pages/Home.js'
import History from './Pages/History.js'
import ManagerTeam from  './Pages/ManagerTeam.js'
import NotFoundPage from './Pages/NotFoundPage.js'
import Information from './Pages/Infomation'
import Exit from './Pages/Exit'

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
