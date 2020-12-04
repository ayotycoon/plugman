
import { types } from '../actions/app.action'
import { darkMode} from '../../Providers/storage.service'


const initialState = {

    title: '',
   
    userData: {
        name: 'ayo'
    },
    finishedAuthenticationAttempt: false,
    darkMode: darkMode.get() === 'true'

}

export default (state = initialState, action: any) => {
    switch (action.type) {
        case types.SETTITLE:

            return {
                ...state, title: action.payload
            }
      
   
     
        case types.SETDARKMODE:

            const newMode = !state.darkMode
            darkMode.set(newMode + '')


            return {
                ...state, darkMode: !state.darkMode
            }


        default:
            return state;

    }

}