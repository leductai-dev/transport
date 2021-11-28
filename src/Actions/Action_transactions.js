

export const setDataTransaction =(data)=>{
    return({
        type : 'Action_Set_Data_Transaction',
         data
    })
} 

export const restricted =()=>{
    return({
        type : 'Action_Restricted',
    })
} 

export const expand =()=>{
    return({
        type : 'Action_Expand',
    })
} 






