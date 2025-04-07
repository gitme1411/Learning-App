import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface ConfigState {
  dataConfig: any;
  timeSysDay: any;
  settingFont: string;
  dateTodayPlan: string;
  numberTopicTodayPlan: number;
  numberPracticeTodayPlan: number;
  numberFinalTestTodayPlan: number;
  numberFailTopicTodayPlan: number;
  numberFailPracticeTodayPlan: number;
  numberFailFinalTestTodayPlan: number;
  dataStudyPlan: any;
  userInfo: any;
  isWaitRemoveAccount: any;
}

const initialState: ConfigState = {
  dataConfig: {
    question_bank_version: 0,
    topic_test_version: 0,
    practice_test_version: 0,
    final_test_version: 0,
  },
  timeSysDay: 1,
  settingFont: 'Medium',
  dateTodayPlan: '',
  numberTopicTodayPlan: 0,
  numberPracticeTodayPlan: 0,
  numberFinalTestTodayPlan: 0,
  numberFailTopicTodayPlan: 0,
  numberFailPracticeTodayPlan: 0,
  numberFailFinalTestTodayPlan: 0,
  dataStudyPlan: null,
  userInfo: null,
  isWaitRemoveAccount: false,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setDataConfig: (state, {payload: dataConfig}) => {
      state.dataConfig = dataConfig;
    },
    setDaySys: (state, {payload: timeSysDay}) => {
      state.timeSysDay = timeSysDay;
    },
    setSettingFont: (state, {payload: settingFont}) => {
      state.settingFont = settingFont;
    },
    setDateTodayPlan: (state, {payload: dateTodayPlan}) => {
      state.dateTodayPlan = dateTodayPlan;
    },
    setNumberTopicTodayPlan: (state, {payload: numberTopic}) => {
      state.numberTopicTodayPlan = numberTopic.numberTopicTodayPlan;
      state.numberFailTopicTodayPlan = numberTopic.numberFailTopicTodayPlan;
    },
    setNumberPracticeTodayPlan: (state, {payload: numberPractice}) => {
      state.numberPracticeTodayPlan = numberPractice.numberPracticeTodayPlan;
      state.numberFailPracticeTodayPlan =
        numberPractice.numberFailPracticeTodayPlan;
    },
    setNumberFinalTestTodayPlan: (state, {payload: numberFinalTest}) => {
      state.numberFinalTestTodayPlan = numberFinalTest.numberFinalTestTodayPlan;
      state.numberFailFinalTestTodayPlan =
        numberFinalTest.numberFailFinalTestTodayPlan;
    },
    setResetTodayPlan: state => {
      state.dateTodayPlan = '';
      state.numberTopicTodayPlan = 0;
      state.numberPracticeTodayPlan = 0;
      state.numberFinalTestTodayPlan = 0;
      state.numberFailTopicTodayPlan = 0;
      state.numberFailPracticeTodayPlan = 0;
      state.numberFailFinalTestTodayPlan = 0;
    },
    setDataStudyPlan: (state, {payload: dataStudyPlan}) => {
      state.dataStudyPlan = dataStudyPlan;
    },
    setDataUser: (state, {payload: userInfo}) => {
      state.userInfo = userInfo;
    },
    setIsWaitRemoveAccount: (state, {payload: isWaitRemoveAccount}) => {
      state.isWaitRemoveAccount = isWaitRemoveAccount;
    },
  },
});

// Action creators are generated for each case reducer function

export const {
  setDataConfig,
  setDaySys,
  setSettingFont,
  setDateTodayPlan,
  setNumberTopicTodayPlan,
  setNumberPracticeTodayPlan,
  setNumberFinalTestTodayPlan,
  setResetTodayPlan,
  setDataStudyPlan,
  setDataUser,
  setIsWaitRemoveAccount,
} = configSlice.actions;

export default configSlice.reducer;
