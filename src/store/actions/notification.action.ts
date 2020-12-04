

export const types = {
   SET_NOTIFICATION_AS_READ : 'SET_NOTIFICATION_AS_READ',
   SET_NOTIFICATIONS : 'SET_NOTIFICATIONS',
   ADD_NOTIFICATION : 'ADD_NOTIFICATION',
}

export const setAsRead = (data: any) => (dispatch: any) => {

        dispatch({
            type: types.SET_NOTIFICATION_AS_READ,
            payload: data
        })



   
}
export const addNotification = (data: any) => (dispatch: any) => {

        dispatch({
            type: types.ADD_NOTIFICATION,
            payload: data
        })



   
}
export const setNotifications = (data: any) => (dispatch: any) => {

        dispatch({
            type: types.SET_NOTIFICATIONS,
            payload: data
        })



   
}