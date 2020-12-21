const initialState = {};


const centerInfo = (state = initialState, action) => {
    switch (action.type) {
        case "Action_SetData_Information":
            {
                state = action.data
                return {...state}
            }
      
        default:
            return {...state}
    }
}
export default centerInfo;