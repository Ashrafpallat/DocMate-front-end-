// redux/slices/patientSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PatientState {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

const initialState: PatientState = {
  name: '',
  email: '',
  isLoggedIn: false,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
      // Save patient info in localStorage
      localStorage.setItem('patient', JSON.stringify(state));
    },
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
      // Remove patient info from localStorage
      localStorage.removeItem('patient');
    },
    loadFromStorage: (state) => {
      const patient = localStorage.getItem('patient');
      if (patient) {
        return JSON.parse(patient);
      }
      return state;
    }
  },
});

export const { login, logout, loadFromStorage } = patientSlice.actions;
export default patientSlice.reducer;
