import {app} from '../firebaseConfig'


export const Set_Data =(data)=>{
    console.log(data);
    return({
        type : 'Action_SetData_For_Authority',
         data
    })
} 


export const Set_Status =()=>{
    return({
        type : 'Action_SetStatus2',
        payload: false
    })
}




