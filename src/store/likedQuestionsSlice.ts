import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LikedQuestionsState {
  likedQuestions: number[];
}

const initialState: LikedQuestionsState = {
  likedQuestions: [],
};

const likedQuestionsSlice = createSlice({
  name: 'listFavorite',
  initialState,
  reducers: {
    likeQuestion: (state, action: PayloadAction<number>) => {
      if (!state.likedQuestions.includes(action.payload)) {
        state.likedQuestions.push(action.payload);
      }
    },
    unlikeQuestion: (state, action: PayloadAction<number>) => {
      state.likedQuestions = state.likedQuestions.filter(
        id => id !== action.payload,
      );
    },
    resetLikedQuestions: state => {
      state.likedQuestions = [];
    },
  },
});

export const {likeQuestion, unlikeQuestion, resetLikedQuestions} =
  likedQuestionsSlice.actions;

export default likedQuestionsSlice.reducer;
