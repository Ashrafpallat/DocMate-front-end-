import { configureStore } from '@reduxjs/toolkit';
import patientSlice from './patientSlice';
import doctorSlice from './doctorSlice';
import adminSlice from './adminSlice';
import notificationSlice from './notificationSlice'

const store = configureStore({
  reducer: {
    doctor: doctorSlice,
    patient: patientSlice,
    admin: adminSlice,
    notifications: notificationSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
