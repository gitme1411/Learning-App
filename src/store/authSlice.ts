// store/authSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  hasOnboarded: string | null;
  token: string | null;
  devicesToken: any | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  hasOnboarded: '',
  token: null,
  devicesToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      AsyncStorage.setItem('token', action.payload);
    },
    logout: state => {
      state.isAuthenticated = false;
      state.token = null;
      AsyncStorage.removeItem('token');
    },
    setHasOnboarded: (state, action: PayloadAction<string>) => {
      state.hasOnboarded = action.payload;
    },
    setDevicesToken: (state, action: PayloadAction<any>) => {
      state.devicesToken = action.payload;
    },
    restoreToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const {login, logout, setDevicesToken, setHasOnboarded, restoreToken} =
  authSlice.actions;
export default authSlice.reducer;
