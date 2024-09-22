import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

// Helper functions to manage local storage
const loadAdminFromLocalStorage = (): AdminState => {
  const admin = localStorage.getItem('admin');
  return admin ? JSON.parse(admin) : { name: '', email: '', isLoggedIn: false };
};

const saveAdminToLocalStorage = (admin: AdminState) => {
  localStorage.setItem('admin', JSON.stringify(admin));
};

const clearAdminFromLocalStorage = () => {
  localStorage.removeItem('admin');
};

const initialState: AdminState = loadAdminFromLocalStorage(); // Load state from local storage

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
      saveAdminToLocalStorage(state); // Save admin to local storage
    },
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
      clearAdminFromLocalStorage(); // Clear admin from local storage
    },
  },
});

export const { login, logout } = adminSlice.actions;
export default adminSlice.reducer;
