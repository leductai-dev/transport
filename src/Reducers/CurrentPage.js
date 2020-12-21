const initialState = "Home";


const currentPage = (state = initialState, action) => {
    switch (action.type) {
        case "Action_SetPage":
            {
                state = action.page
                return state
            }
     
        default:
            return state
    }
}
export default currentPage;