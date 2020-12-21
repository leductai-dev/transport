const initialState = "";


const userID = (state = initialState, action) => {
    switch (action.type) {
        case "Action_UserID":
            {
                state = action.payload
                return {...state}
            }
     
        default:
            return state
    }
}
export default userID;