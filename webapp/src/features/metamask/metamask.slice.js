import { createSlice } from '@reduxjs/toolkit';
import { METAMASK_INITIAL_STATE } from './metamask.constants';

export const metamaskSlice = createSlice({
    name: 'metamaskSlice',
    initialState: METAMASK_INITIAL_STATE,
    reducers: {
        setAddress: (state, action) => {
            state.userAddress = action.payload.userAddress
        },
        requestAddressFailed: (_, action) => {
            console.error(action.payload.message);
        },
        setTokenBalance: (state, action) => {
            state.balance = action.payload.balance
        },
        setUserNames: (state, action) => {
            state.userNames = [...action.payload.userNames]
        },
        setApproved: (state, action) => {
            state.approved = action.payload.approved;
        }
    }
});

export const {
    requestAddressFailed,
    setAddress,
    setTokenBalance,
    setUserNames,
    setApproved
} = metamaskSlice.actions;

export default metamaskSlice.reducer;
