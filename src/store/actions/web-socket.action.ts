

export const types = {
   SET_SOCKET_STATUS : 'SET_SOCKET_STATUS',
    ADD_ACTIVITY: 'ADD_ACTIVITY'
  

}

export const setStatus = (data: any) => (dispatch: any) => {

        dispatch({
            type: types.SET_SOCKET_STATUS,
            payload: data
        })



   
}

export const addActivity = (data: any) => (dispatch: any) => {

    dispatch({
        type: types.ADD_ACTIVITY,
        payload: data
    })




}