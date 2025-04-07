import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface CreateStepPlan {
  dataCreateStepPlan: any;
  daysCountDownt: number;
  totalQuestion: number;
}

const initialState: CreateStepPlan = {
  dataCreateStepPlan: {},
  daysCountDownt: 0,
  totalQuestion: 0,
};

const createStepPlanSlice = createSlice({
  name: 'dataCreateStepPlan',
  initialState,
  reducers: {
    updateData(state, action: PayloadAction<{}>) {
      state.dataCreateStepPlan = {
        ...state.dataCreateStepPlan,
        ...action.payload,
      };
    },
    setTotalQuestion(state, action: PayloadAction<number>) {
      state.totalQuestion = action.payload;
    },
    setDaysCountDownt(state, action: PayloadAction<number>) {
      state.daysCountDownt = action.payload;
    },
    decrementDay: state => {
      if (state.daysCountDownt > 0) {
        state.daysCountDownt -= 1;
      }
    },
  },
});

// Action creators are generated for each case reducer function

export const {updateData, setDaysCountDownt, decrementDay, setTotalQuestion} =
  createStepPlanSlice.actions;

export default createStepPlanSlice.reducer;
