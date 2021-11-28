const initialState = false;


const ExpandMenu = (state = initialState, action) => {
    switch (action.type) {
        case "Action_Restricted":
            {
                return !state
            }
            case "Action_Expand":
                {
                    return !state
                }
     
        default:
            return state
    }
}
export default ExpandMenu;