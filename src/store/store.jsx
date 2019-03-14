import { createStore, combineReducers, compose } from 'redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import firebase from 'firebase/app';
import  'firebase/auth';
import  'firebase/database';




import { combineReducers,createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as all_reducers from '../reducers';
import {i18nState} from "redux-i18n";
//import API  from './api';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers(Object.assign({},{i18nState},all_reducers));

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === `development`) {
    const { createLogger } = require('redux-logger');
    const logger = createLogger(/*{
        predicate, // if specified this function will be called before each action is processed with this middleware.
        collapsed, // takes a Boolean or optionally a Function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.
        duration = false: Boolean, // print the duration of each action?
        timestamp = true: Boolean, // print the timestamp with each action?

        level = 'log': 'log' | 'console' | 'warn' | 'error' | 'info', // console's level
        colors: ColorsObject, // colors for title, prev state, action and next state: https://github.com/evgenyrodionov/redux-logger/blob/master/src/defaults.js#L12-L18
        titleFormatter, // Format the title used when logging actions.

        stateTransformer, // Transform state before print. Eg. convert Immutable object to plain JSON.
        actionTransformer, // Transform action before print. Eg. convert Immutable object to plain JSON.
        errorTransformer, // Transform error before print. Eg. convert Immutable object to plain JSON.

        logger = console: LoggerObject, // implementation of the `console` API.
        logErrors = true: Boolean, // should the logger catch, log, and re-throw errors?

        diff = false: Boolean, // (alpha) show diff between states?
        diffPredicate // (alpha) filter function for showing states diff, similar to `predicate`
    }*/);
    middlewares.push(logger);
}
const store = createStore(reducers, composeEnhancers(applyMiddleware(...middlewares)));
export default store;



// WEBPACK FOOTER //
// ./src/utils/store.js