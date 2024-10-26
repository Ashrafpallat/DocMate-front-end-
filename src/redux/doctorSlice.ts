import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  email: string;
  profilePhoto: string
  isLoggedIn: boolean;
  KycVerified: boolean
}

const initialState: UserState = {
  name: '',
  email: '',
  profilePhoto: '',
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
    login: (state, action: PayloadAction<{ name: string; email: string; kycVerified: boolean; profilePhoto: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
      state.KycVerified = action.payload.kycVerified
      state.profilePhoto = action.payload.profilePhoto
      saveUserToLocalStorage(state); // Save user to local storage
    },
    logoutDoctor: (state) => {
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
      state.profilePhoto = ''
      clearUserFromLocalStorage(); // Clear user from local storage
    },
    changeKycStatus: (state, action: PayloadAction<{ kycVerified: boolean }>)=>{
      state.KycVerified = action.payload.kycVerified
      saveUserToLocalStorage(state); // Save user to local storage
    }
  },
});

export const { login, logoutDoctor, changeKycStatus } = userSlice.actions;
export default userSlice.reducer;
