// // redux/slices/patientSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PatientState {
  name: string;
  email: string;
  profilePhoto: string
  isLoggedIn: boolean;
}

const initialState: PatientState = {
  name: '',
  email: '',
  profilePhoto: '',
  isLoggedIn: false,
};

// Helper functions to manage local storage
const loadPatientFromLocalStorage = (): PatientState => {
  const patient = localStorage.getItem('patient');
  return patient ? JSON.parse(patient) : initialState;
};

const savePatientToLocalStorage = (patient: PatientState) => {
  localStorage.setItem('patient', JSON.stringify(patient));
};

const clearPatientFromLocalStorage = () => {
  localStorage.removeItem('patient');
};

const patientSlice = createSlice({
  name: 'patient',
  initialState: loadPatientFromLocalStorage(), // Load state from local storage
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string; profilePhoto: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profilePhoto = action.payload.profilePhoto;
      state.isLoggedIn = true;
      savePatientToLocalStorage(state); // Save patient to local storage
    },
    logoutPatient : (state) => {
      state.name = '';
      state.email = '';
      state.profilePhoto = ''
      state.isLoggedIn = false;
      clearPatientFromLocalStorage(); // Clear patient from local storage
    },
  },
});

export const { login, logoutPatient  } = patientSlice.actions;
export default patientSlice.reducer;
