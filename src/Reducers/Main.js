import {combineReducers} from 'redux'
import centerInfo from './CenterInfo'
import expandMenu from './ExpanMenu';
import centerData from './CenterData';
import transactions from './Transactions';
import userLogin from './UserLogin';
import userlocation from './UserLocation';




const appReducers = combineReducers({
    centerInfo,expandMenu,centerData,transactions,userLogin,userlocation
})
export default appReducers;
