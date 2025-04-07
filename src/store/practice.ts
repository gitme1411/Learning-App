import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {dataPractice} from '../database';

export interface PracticeState {
  dataPractice: any;
  dataProgress: any;
}

const initialState: PracticeState = {
  dataPractice: [],
  dataProgress: {
    target_questions: 180,
    current_questions: 0,
    q_correct: 0,
    q_wrong: 0,
    q_not_answer: 0,
  },
};

const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    setDataLocalPractice: (state, {payload: dataPractice}) => {
      state.dataPractice = dataPractice;
    },
    setDataProgressPractice: (state, {payload: dataProgress}) => {
      state.dataProgress = dataProgress;
    },
  },
});

// Action creators are generated for each case reducer function

export const {setDataLocalPractice, setDataProgressPractice} =
  practiceSlice.actions;

export default practiceSlice.reducer;
