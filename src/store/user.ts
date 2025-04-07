import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { dataTopics } from '../database'

export interface UserState {
    token: any,
    profile: any,
    language: number
}

const initialState: UserState = {
    token: "",
    profile: {},
    language: 0
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setToken: (state, { payload: token }) => {
            state.token = token
        },
        setLanguage: (state, { payload: language }) => {
            state.language = language
        },
    },
})

// Action creators are generated for each case reducer function

export const { setToken, setLanguage } = userSlice.actions


export default userSlice.reducer