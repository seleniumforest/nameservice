import { createSlice } from '@reduxjs/toolkit';
import { CHECKER_INITIAL_STATE } from './namechecker.constants';

export const nameCheckerSlice = createSlice({
    name: 'nameCheckerSlice',
    initialState: CHECKER_INITIAL_STATE,
    reducers: {
        setInput: (state, action) => {
            state.nameInput = action.payload.nameInput
        },
        setResolvedAddress: (state, action) => {
            state.resolvedAddress = action.payload.resolvedAddress;
            state.resolvedName = action.payload.resolvedName;
        }
    }
});

export const { 
    setInput,
    setResolvedAddress
} = nameCheckerSlice.actions;

export default nameCheckerSlice.reducer;
