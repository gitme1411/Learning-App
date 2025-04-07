import {createSlice} from '@reduxjs/toolkit';

export interface TopicsState {
  dataTopics: any;
  dataProgress: any;
  dataProgressTopic: any;
}

const initialState: TopicsState = {
  dataTopics: [],
  dataProgress: {
    target_questions: 180,
    current_questions: 0,
    q_correct: 0,
    q_wrong: 0,
    q_not_answer: 0,
  },
  dataProgressTopic: [],
};

const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    setDataLocalTopic: (state, {payload: dataTopics}) => {
      state.dataTopics = dataTopics;
    },
    setDataProgress: (state, {payload: dataProgress}) => {
      state.dataProgress = dataProgress;
    },
    setDataProgressTopic: (state, {payload: dataProgressTopic}) => {
      state.dataProgressTopic = dataProgressTopic;
    },
  },
});

// Action creators are generated for each case reducer function

export const {setDataLocalTopic, setDataProgress, setDataProgressTopic} =
  topicsSlice.actions;

export default topicsSlice.reducer;
