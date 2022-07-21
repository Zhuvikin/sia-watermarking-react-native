import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';

export interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const siaSlice = createSlice({
  name: 'sia',
  initialState,
  reducers: {
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { incrementByAmount } = siaSlice.actions;

export const selectCount = (state: RootState) => state.sia.value;

export default siaSlice.reducer;
