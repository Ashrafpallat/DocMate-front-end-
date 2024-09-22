import { configureStore } from '@reduxjs/toolkit';
import patientSlice from './patientSlice';
import doctorSlice from './doctorSlice';

const store = configureStore({
  reducer: {
    doctor: doctorSlice,
    patient: patientSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
