
import { types } from '../actions/app.action'
import { darkMode} from '../../Providers/storage.service'


const initialState = {

    title: '',
   
    userData: {
        name: 'ayo'
    },
    activeTree: '',
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
        case types.SETACTIVETREE:

          
            return {...state, activeTree: action.payload}


        default:
            return state;

    }

}