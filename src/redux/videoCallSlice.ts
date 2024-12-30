import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VideoCallState {
  url: string | null;
}

const initialState: VideoCallState = {
  url: null,
};

const videoCallSlice = createSlice({
  name: 'videoCall',
  initialState,
  reducers: {
    setVideoCallUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    clearVideoCallUrl: (state) => {
      state.url = null;
    },
  },
});

export const { setVideoCallUrl, clearVideoCallUrl } = videoCallSlice.actions;

export default videoCallSlice.reducer;
