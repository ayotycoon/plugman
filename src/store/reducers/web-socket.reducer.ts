
import { types } from '../actions/web-socket.action'


const initialState = {

    status: {},
    activities: []
}
export default (state = initialState, action: any) => {
    switch (action.type) {
        case types.SET_SOCKET_STATUS:



            return { ...state, status: action.payload }
        case types.ADD_ACTIVITY:



            return { ...state, activities: [...state.activities, action.payload] }



        default:
            return state;

    }

}