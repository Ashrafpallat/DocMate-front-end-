import React, { useEffect, useState } from 'react';
import { getPatientHistory } from '../services/patientServices';
import { useLocation } from 'react-router-dom';
import { getHistory } from '../services/doctorServices';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { useSocket } from '../context/SocketContext';
import { BarLoader, ClipLoader } from 'react-spinners';
import api from '../services/axiosInstance';
import { useDispatch } from 'react-redux';
import { incrementUnreadCount, setUnreadCounts } from '../redux/notificationSlice';

interface ChatListItem {
  lastMessageTime: string | number | Date;
  chatId: any;
  _id: string;
  name: string;
  profilePhoto: string;
  lastMessage: any
}

interface User {
  chatId: any;
  patientId: any;
  doctorId: {
    _id: string;
    name: string;
    profilePhoto: string;
  }

}

interface ChatListProps {
  chatUsers: ChatListItem[];
  onSelectChat: (chat: ChatListItem) => void;
  chatLoading: boolean
}
interface UnreadMessage {
  chatId: string;
  count: number;
}

const ChatList: React.FC<ChatListProps> = ({ chatUsers, onSelectChat, chatLoading }) => {
  const socket = useSocket();
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const [newChatUsers, setNewChatUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatedChatUsers, setUpdatedChatUsers] = useState<ChatListItem[]>(chatUsers)
  const [typingStatus, setTypingStatus] = useState<{ [chatId: string]: boolean }>({});
  const [unreadMessageCount, setUnreadMessageCount] = useState<UnreadMessage[]>([]);
  const sortChatsByLastMessageTime = (chatUsers: ChatListItem[]): ChatListItem[] =>
    chatUsers.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());


  useEffect(() => {
    const sortedChats = sortChatsByLastMessageTime(chatUsers);
    setUpdatedChatUsers(sortedChats);

  }, [chatUsers]);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        // Fetch unread message counts for all chats in parallel
        const responses = await Promise.all(
          chatUsers.map((chatUser) =>
            api.get(`/chat/getUnread-messageCount/${chatUser.chatId}`).then((response) => ({
              chatId: chatUser.chatId,
              count: response.data,
            }))
          )
        );

        // Update state with the results
        setUnreadMessageCount(responses);
        dispatch(setUnreadCounts(responses));

        console.log('unread message count', unreadMessageCount);

      } catch (error) {
        console.error("Error fetching unread message counts:", error);
      }
    };

    if (chatUsers.length > 0) {
      fetchUnreadCounts();
    }
  }, [updatedChatUsers])

  useEffect(() => {
    if (!socket) return;
    socket.on('receiveMessage', (message) => {
      console.log('new message', message);
      const { chatId } = message;
      dispatch(incrementUnreadCount({ chatId }));

      setUpdatedChatUsers((prevChatUsers) => {
        // Update the relevant chat with the new message
        const updatedChats = prevChatUsers.map((chatUser) =>
          chatUser.chatId === message.chatId
            ? {
              ...chatUser,
              lastMessage: message.content,
              lastMessageTime: message.updatedAt,
            }
            : chatUser
        );
        // Sort the updated chats before returning
        return sortChatsByLastMessageTime(updatedChats);
      });
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket]);




  useEffect(() => {
    if (!socket) return;
    socket.on('typing', (chatId) => {
      setTypingStatus((prevStatus) => ({
        ...prevStatus,
        [chatId]: true,
      }));
    });
    socket.on('stopTyping', (chatId) => {
      setTypingStatus((prevStatus) => ({
        ...prevStatus,
        [chatId]: false,
      }));
    });
    return () => {
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [socket]);

  const location = useLocation();
  const isDoctorRoute = location.pathname.includes('/doctor');
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      if (isDoctorRoute) {
        const data = await getHistory()
        setNewChatUsers(data);
      } else {
        const response = await getPatientHistory()
        setNewChatUsers(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };
  const handleUserSelect = async (user: User) => {
    try {
      // const response = await api.post('/chat/fetchOrCreateChat', {
      //   user1: doctor.doctorId._id, // Adjust the API payload as needed
      // });
      const newChatUser = {
        _id: user.doctorId._id || user.patientId._id,
        chatId: user.chatId,
        name: user.doctorId.name || user.patientId.name,
        profilePhoto: user.doctorId.profilePhoto || user.patientId.profilePhoto,
        lastMessage: '',
        lastMessageTime: '',
      };
      // Pass the chat to the parent component
      onSelectChat(newChatUser);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };
  useEffect(() => {
    if (!socket || updatedChatUsers.length === 0) return;
    // Join relevant chat rooms for the current user
    updatedChatUsers.forEach((user) => {
      const chatId = user.chatId;
      socket.emit('joinRoom', chatId);
      console.log(`User joined room from chat list: ${chatId}`);
    });

    // Optional: Clean up when the component is unmounted or when users change
    return () => {
      updatedChatUsers.forEach((user) => {
        const chatId = user.chatId;
        socket.emit('leaveRoom', chatId);
        console.log(`User left room from chat list: ${chatId}`);
      });
    };
  }, [socket, updatedChatUsers]);
  return (
    <div className="w-full sm:w-1/3 bg-[#FAF9F6] p-2 pt-4 shadow-md rounded-lg relative min-w-64">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pb-4 text-gray-400 ">
          <SearchIcon fontSize='small' />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isDoctorRoute ? 'Search a patient' : 'Search a Doctor'}
          className="w-full border border-gray-300 rounded-md p-2 pl-10 mb-4 focus:outline-none"
        />
      </div>
      {chatLoading ? (
        // <p className="text-sm text-gray-500">Loading...</p>
        <div className='flex justify-center pt-[40%]'>
          <BarLoader color='#996337'/>
        </div>
      ) : updatedChatUsers.length > 0 ? (
        <ul>
          {updatedChatUsers
            .filter((chatUser) =>
              chatUser.name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((chatUser) => (
              <li
                key={chatUser._id}
                onClick={() => onSelectChat(chatUser)}
                className="flex items-center gap-4 p-3 mb-2 hover:bg-[#ece9e2] cursor-pointer rounded-md"
              >
                <img
                  src={chatUser.profilePhoto}
                  alt={chatUser.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-md font-medium flex items-center gap-2">
                    {chatUser.name}
                    {
                      (() => {
                        const unreadCount = unreadMessageCount.find(
                          (item) => item.chatId === chatUser.chatId
                        )?.count;
                        return unreadCount && unreadCount > 0 ? (
                          <span
                            className="rounded-full bg-[#996337] text-white text-xs font-bold flex items-center justify-center"
                            style={{
                              width: "20px",
                              height: "20px",
                            }}
                          >
                            {unreadCount}
                          </span>
                        ) : null;
                      })()
                    }
                  </h3>
                  <p
                    className={`text-sm truncate ${typingStatus[chatUser.chatId]
                        ? "text-[#996337] font-medium"
                        : (() => {
                          const unreadCount = unreadMessageCount.find(
                            (item) => item.chatId === chatUser.chatId
                          )?.count;
                          return unreadCount && unreadCount > 0
                            ? "font-bold"
                            : "text-gray-500";
                        })()
                      }`}
                  >
                    {typingStatus[chatUser.chatId]
                      ? "Typing..."
                      : chatUser.lastMessage}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No chatUsers found.</p>
      )}


      {/* Add Chat Button */}
      <button
        onClick={() => {
          setShowModal(true);
          fetchDoctors();
        }}
        className="absolute bottom-8 right-8 bg-[#996337] text-white p-5 rounded-full shadow-md hover:bg-[#885831]"
      >
        <PersonAddIcon />
      </button>

      {/* Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-[#FAF9F6] rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">{isDoctorRoute ? 'Select a Patient' : 'Select a Doctor'}</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isDoctorRoute ? 'Search a patient' : 'Search a Doctor'}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
            />
            {loading ? (
              // <p className="text-center text-gray-500">Loading...</p>
              <div className='text-center'>
                <ClipLoader />
              </div>
            ) : (
              <ul>
                {newChatUsers
                  .filter((newChatUser) =>
                    newChatUser.doctorId.name?.toLowerCase().includes(searchQuery.toLowerCase()) || newChatUser.patientId.name?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((newChatUser) => (
                    <li
                      key={newChatUser.doctorId._id || newChatUser.patientId._id}
                      onClick={() => handleUserSelect(newChatUser)}
                      className="flex items-center gap-4 p-3 mb-2 hover:bg-gray-100 cursor-pointer rounded-md"
                    >
                      <img
                        src={newChatUser.doctorId.profilePhoto || newChatUser.patientId.profilePhoto}
                        alt={newChatUser.doctorId.name || newChatUser.patientId.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <h3 className="text-sm font-medium">{newChatUser.doctorId.name || newChatUser.patientId.name}</h3>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;
