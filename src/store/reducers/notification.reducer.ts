
import { types } from '../actions/notification.action'


const initialState = null as any

export default (state = initialState, action: any) => {
    switch (action.type) {
        case types.SET_NOTIFICATION_AS_READ:

            const m = [
                ...state
            ]
          
            m[action.payload].read = true;

            return [
                ...m
            ]
        case types.ADD_NOTIFICATION:

            const n = [
                ...state
            ]
          
            n.unshift(action.payload)

            return [
                ...n
            ]
        
        case types.SET_NOTIFICATIONS:

            return [
                ...action.payload
            ]
        

        default:
            return state;

    }

}