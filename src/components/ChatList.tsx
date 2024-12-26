import React, { useEffect, useState } from 'react';
import { getPatientHistory } from '../services/patientServices';
import { useLocation } from 'react-router-dom';
import { getHistory } from '../services/doctorServices';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_URL as string, {
  reconnectionAttempts: 5, // Limit to 5 attempts
  reconnectionDelay: 1000, // 1 second delay between attempts
});
interface ChatListItem {
  _id: string;
  name: string;
  profilePhoto: string;
  lastMessage: any
}

interface User {
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
}

const ChatList: React.FC<ChatListProps> = ({ chatUsers, onSelectChat }) => {
  console.log('passed chatuers from chat list',chatUsers);
  useEffect(()=>{
    setUpdatedChatUsers(chatUsers)
  })
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      console.log('meesage recived',message);
      
      setUpdatedChatUsers((prevChatUsers) =>
        prevChatUsers.map((chatUser) =>
          chatUser._id === message.chatId
            ? { ...chatUser, lastMessage: message.content }
            : chatUser
        )
      );        
    });

    return () => {
      // Cleanup: remove listener on component unmount
      socket.off('receiveMessage');
    };
  },[]);
  const [showModal, setShowModal] = useState(false);
  const [newChatUsers, setNewChatUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatedChatUsers, setUpdatedChatUsers] = useState<ChatListItem[]>(chatUsers)
  console.log('updatechatuers',updatedChatUsers);
  
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
        name: user.doctorId.name || user.patientId.name,
        profilePhoto: user.doctorId.profilePhoto || user.patientId.profilePhoto,
        lastMessage: '', // Add actual last message 
      };

      // Pass the chat to the parent component
      onSelectChat(newChatUser);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="w-1/3 bg-[#FAF9F6] p-2 pt-4 shadow-md rounded-lg relative">
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

      {updatedChatUsers.length > 0 ? (
        <ul>
          {updatedChatUsers
            .filter((chatUser) =>
              chatUser.name?.toLowerCase().includes(searchQuery.toLowerCase()) || chatUser.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <h3 className="text-sm font-medium">{chatUser.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{chatUser.lastMessage}</p>
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
              <p className="text-center text-gray-500">Loading...</p>
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
