// redux/slices/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UnreadCount {
  chatId: string;
  count: number;
}

interface NotificationState {
  totalUnreadCount: number;
  unreadCounts: UnreadCount[];
}

const initialState: NotificationState = {
  totalUnreadCount: 0,
  unreadCounts: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCounts: (state, action: PayloadAction<UnreadCount[]>) => {
      state.unreadCounts = action.payload;
      state.totalUnreadCount = action.payload.reduce(
        (total, chat) => total + chat.count,
        0
      );
    },
    incrementUnreadCount: (state, action: PayloadAction<{ chatId: string }>) => {
      const { chatId } = action.payload;
      const chat = state.unreadCounts.find((c) => c.chatId === chatId);
      if (chat) {
        chat.count += 1;
        state.totalUnreadCount += 1;
      } else {
        state.unreadCounts.push({ chatId, count: 1 });
        state.totalUnreadCount += 1;
      }
    },
  },
});

export const { setUnreadCounts, incrementUnreadCount } =
  notificationSlice.actions;

export default notificationSlice.reducer;
