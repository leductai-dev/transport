
import {app} from '../firebaseConfig'

export const Action_SetData =(data)=>{
    return({
        type : 'Action_SetData',
         data
    })
} 
export const Action_SetData_Information =(data)=>{
    return({
        type : 'Action_SetData_Information',
         data
    })
} 
export const Set_Team =(data)=>{
    return({
        type : 'Action_Set_CurrentTeam',
         data
    })
} 



var dispatchCount = true;

export const Read_Data = ()=>{
            return (dispatch)=>{
                const database = app.database().ref().child('CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/InforTeam')
                return  database.once('value')
                .then(function(dataSnapshot) {
                const teamFirst = Object.keys(dataSnapshot.val())[0]
                dispatch(Action_SetData(dataSnapshot.val()));
                console.log("gọi lên server")
                if(dispatchCount){
                dispatch(Set_Team(teamFirst))
                }
                dispatchCount =false
                });
            }
}


export const Read_Data_Information = ()=>{
    return (dispatch)=>{
        const database = app.database().ref().child('InfomationCenter/yym15naI10VGGoK94hR1Pa7eFX52/')
        return  database.once('value')
        .then(function(dataSnapshot) {
         console.log(JSON.stringify(dataSnapshot.val()));
        dispatch(Action_SetData_Information(dataSnapshot.val()));
        });
    }
}


  
export const Set_Page =(page)=>{
    return({
        type : 'Action_SetPage',
        page
    })
}

export const UserLogin =(id)=>{
    return({
        type : 'Action_UserLogin',
         payload: id
    })
} 