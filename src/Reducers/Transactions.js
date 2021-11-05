const initialState = null

const transactions = (state = initialState, action) => {
    switch (action.type) {
        case "Action_Set_Data_Transaction":
            {
             const newState =action.data 
              return newState
            }
       
        default:
            return state
    }
}
export default transactions;


