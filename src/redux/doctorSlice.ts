import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  email: string;
  isLoggedIn: boolean;
  KycVerified: boolean
}

const initialState: UserState = {
  name: '',
  email: '',
  isLoggedIn: false,
  KycVerified: false
};

// Helper functions to manage local storage
const loadUserFromLocalStorage = (): UserState => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : initialState;
};

const saveUserToLocalStorage = (user: UserState) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const clearUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};

const userSlice = createSlice({
  name: 'doctor',
  initialState: loadUserFromLocalStorage(), // Load state from local storage
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string; kycVerified: boolean }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
      state.KycVerified = action.payload.kycVerified
      saveUserToLocalStorage(state); // Save user to local storage
    },
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
      clearUserFromLocalStorage(); // Clear user from local storage
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
