const initialState = {
    user_ID: 'taile',
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case "Action_UserLogin":
           {
              return {...state,user_ID:'ducttai'}
            }
       
        default:
            return state
    }
}
export default user;


