import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {dataQuestions} from '../database';

export interface QuestionsState {
  pendingRating: {
    question_id: any;
    rate: number;
    comment: string;
  } | null;
}

const initialState: QuestionsState = {
  pendingRating: null,
};

const questionsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    setPendingRating: (state, {payload: pendingRating}) => {
      state.pendingRating = pendingRating;
    },
    clearPendingRating: state => {
      state.pendingRating = null;
    },
  },
});

// Action creators are generated for each case reducer function

export const { setPendingRating, clearPendingRating} =
  questionsSlice.actions;

export default questionsSlice.reducer;
