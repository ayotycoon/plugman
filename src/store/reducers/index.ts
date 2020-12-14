import {combineReducers} from 'redux';

import networkReducer from './network.reducer';
import appReducer from './app.reducer';
import socketIOReducer from './socket.reducer';
import webSocketReducer from './web-socket.reducer';

export default combineReducers({
    network: networkReducer,
    app: appReducer,
    socketIO: socketIOReducer,
    webSocket: webSocketReducer

})