
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



export const Read_Data = ()=>{
            return (dispatch)=>{
                const database = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam`)
                return  database.once('value')
                .then(function(dataSnapshot) {
                const teamFirst = Object.keys(dataSnapshot.val())[0]
                dispatch(Action_SetData(dataSnapshot.val()));
                console.log("gọi lên server của hàm once")
                dispatch(Set_Team(teamFirst))
                });
            }
}
export const On_Read_Data = ()=>{
    return (dispatch)=>{
        const database = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam`)
        return  database.once('value')
        .then(function(dataSnapshot) {
        dispatch(Action_SetData(dataSnapshot.val()));
        console.log("gọi lên server của hàm on")
        });
    }
}




export const Read_Data_Information = ()=>{
    return (dispatch)=>{
        const database = app.database().ref().child(`InfomationCenter/${localStorage.getItem('centerID')}/`)
        return  database.once('value')
        .then(function(dataSnapshot) {
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

export const UserLogin =(user)=>{
    return({
        type : 'Action_UserLogin',
         payload: user
    })
} 


export const SetUserLocation =(location)=>{
    return({
        type : 'Action_Set_UserLocation',
         payload: location
    })
} 