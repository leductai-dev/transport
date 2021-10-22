import {combineReducers} from 'redux'
import centerInfo from './CenterInfo'
import currentPage from './CurrentPage';
import centerData from './CenterData';
import transaction2 from './Transactions';
import userLogin from './UserLogin';
import userlocation from './UserLocation';




const appReducers = combineReducers({
    centerInfo,currentPage,centerData,transaction2,userLogin,userlocation
})
export default appReducers;
