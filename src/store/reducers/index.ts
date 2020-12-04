import {combineReducers} from 'redux';

import networkReducer from './network.reducer';
import appReducer from './app.reducer';
import notificationsReducer  from './notification.reducer';
import socketReducer from './socket.reducer';

export default combineReducers({
    network: networkReducer,
    app: appReducer,
    notifications: notificationsReducer ,
    socket: socketReducer,

})