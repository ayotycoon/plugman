import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const  env  =  require('../env.json')
// fixed bug
const initialState = {}
const middleware = [thunk]


let compose_ = compose(applyMiddleware(...middleware))

if(!env.prod) {
  // @ts-ignore
    compose_ = compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
}

const store = createStore(rootReducer, initialState, 
  compose_
    )

export {store, Provider};