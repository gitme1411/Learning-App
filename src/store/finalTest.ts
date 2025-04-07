import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {dataFinalTest} from '../database';

export interface FinalTestState {
  dataFinalTest: any;
  dataProgress: any;
}

const initialState: FinalTestState = {
  dataFinalTest: [],
  dataProgress: {
    target_questions: 180,
    current_questions: 0,
    q_correct: 0,
    q_wrong: 0,
    q_not_answer: 0,
  },
};

const finalTestSlice = createSlice({
  name: 'finalTest',
  initialState,
  reducers: {
    setDataLocalFinalTest: (state, {payload: dataFinalTest}) => {
      state.dataFinalTest = dataFinalTest;
    },
    setDataProgressFinalTest: (state, {payload: dataProgress}) => {
      state.dataProgress = dataProgress;
    },
  },
});

// Action creators are generated for each case reducer function

export const {setDataLocalFinalTest, setDataProgressFinalTest} =
  finalTestSlice.actions;

export default finalTestSlice.reducer;
