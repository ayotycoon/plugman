import { types } from '../actions/network.action'


const initialState = {
   
      loading: false
    
}

export default (state = initialState, action: any) => {
    switch (action.type) {
        case types.LOADINGSTART:
            
            return {
                ...state, loading: true
            }
        case types.LOADINGEND:
            
            return {
                ...state, loading: false
            }

  
        default:
            return state;

    }

}