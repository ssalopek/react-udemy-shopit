import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { productsReducer, productDetailsReducer } from './reducers/productReducers';

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer
})

//contains all data I want to put into the state, before loading application
let initialState = {} 

//contains all middleware I will/want use
const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;