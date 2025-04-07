import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface QuseStatisState {
  dataWrong: any;
  dataHardest: any;
  dataWeak: any;
  dataFavorite: any;
}

const initialState: QuseStatisState = {
  dataWrong: [],
  dataHardest: [],
  dataWeak: [],
  dataFavorite: [],
};

const quesStatisSlice = createSlice({
  name: 'quesStatis',
  initialState,
  reducers: {
    setDataFavorite: (state, {payload: ques}) => {
      state.dataFavorite = [...state.dataFavorite, {...ques}];
    },
    setDataWrong: (state, {payload: dataWrong}) => {
      state.dataWrong = [...dataWrong];
    },
  },
});

// Action creators are generated for each case reducer function

export const {setDataFavorite, setDataWrong} = quesStatisSlice.actions;

export default quesStatisSlice.reducer;
