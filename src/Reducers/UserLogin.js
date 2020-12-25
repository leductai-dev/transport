const initialState = {
  
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case "Action_UserLogin":
           {
               state= action.payload
              return {...state}
            }
       
        default:
            return state
    }
}
export default user;


