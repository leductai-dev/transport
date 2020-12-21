const initialState = {
    currentTeam:"",
    dataCenter:{}
};

const centerMember = (state = initialState, action) => {
    switch (action.type) {
     
        case "Action_SetData":
           {
                return {...state,dataCenter:action.data}
           }

           case "Action_Set_CurrentTeam":
            {
                 return {...state,currentTeam:action.data}
            }
           
           
           
        
        default:
            return {...state}

}
}
export default centerMember