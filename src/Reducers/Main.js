import {combineReducers} from 'redux'
import centerInfo from './CenterInfo'
import currentPage from './CurrentPage';
import centerData from './CenterData';
import transactions from './Transactions';
import userLogin from './UserLogin';
import userlocation from './UserLocation';




const appReducers = combineReducers({
    centerInfo,currentPage,centerData,transactions,userLogin,userlocation
})
export default appReducers;
