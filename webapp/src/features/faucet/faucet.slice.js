import { createSlice } from '@reduxjs/toolkit';
import { FAUCET_INITIAL_STATE as FAUCET_INITIAL_STATE } from './faucet.constants';

export const faucetSlice = createSlice({
    name: 'nameCheckerSlice',
    initialState: FAUCET_INITIAL_STATE,
    reducers: {
        setClaimed: (state, action) => {
            state.claimed = action.payload.claimed
        }
    }
});

export const { 
    setClaimed
} = faucetSlice.actions;

export default faucetSlice.reducer;
