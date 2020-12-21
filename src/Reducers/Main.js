import {combineReducers} from 'redux'
import centerInfo from './CenterInfo'
import currentPage from './CurrentPage';
import centerData from './CenterData';
import transaction2 from './Transactions';
import user from './UserLogin';



const appReducers = combineReducers({
    centerInfo,currentPage,centerData,transaction2,user,
})
export default appReducers;
