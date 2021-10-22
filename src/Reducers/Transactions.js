const initialState = {
    status: false,
    request_data: {}
}

const currentPage = (state = initialState, action) => {
    switch (action.type) {
        case "Action_SetData_For_Authority":
            {
              state = {
                status:true,
                request_data:action.data
             }
              return state
            }
        case "Action_SetStatus2":
                {
                  state = {...state,status:action.payload}
                  return state
                 }
        default:
            return state
    }
}
export default currentPage;


