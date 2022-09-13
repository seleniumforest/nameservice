import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from "redux-saga";
import { faucetSlice } from './features/faucet';
import { metamaskSlice } from './features/metamask';
import { nameCheckerSlice } from './features/nameChecker';
import rootSaga from './rootSaga';

const logger = store => next => action => {
    if (action.type) {
        console.group(action.type)
        console.info('dispatching', action)
    }
    let result = next(action)

    if (action.type) {
        console.log('next state', store.getState())
        console.groupEnd()
    }
    return result;
}

const sagaMw = createSagaMiddleware();
const store = configureStore({
    reducer: {
        metamaskSlice: metamaskSlice,
        nameCheckerSlice: nameCheckerSlice,
        faucetSlice: faucetSlice
    },
    middleware: [
        logger,
        sagaMw
    ],
});

sagaMw.run(rootSaga);

export { store };