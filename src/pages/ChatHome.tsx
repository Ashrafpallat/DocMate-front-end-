import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PatientHeader from '../components/patient/PatientHeader';
import DoctorHeader from '../components/doctor/DoctorHeader';
import ChatList from '../components/ChatList';
import ChatInterface from '../components/ChatInterface';
import { getAllChats } from '../services/ChatService';
import { useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function ChatHome() {
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUesr] = useState<any | null>(null);
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true)
        // const response = await api.get('/chat/allChats');
        const response = await getAllChats()
        console.log('all chats response.data', response?.data);

        if (response?.data) {
          const chatList = response.data.map((item: any) => ({
            chatId: item._id,
            _id: item.doctor._id || item.patient._id,
            name: item.doctor.name || item.patient.name,
            profilePhoto: item.doctor.profilePhoto || item.patient.profilePhoto,
            lastMessage: item.lastMessage?.content || 'last message', 
            lastMessageTime: item.lastMessageTime
          }));
          setChatUsers(chatList);
          setLoading(false)
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false)
      }
    };

    fetchChats();
  }, []);

  const handleSelectChat = (chatUser: any) => {
    setSelectedUesr(chatUser);
  };
  

  // Render the appropriate header based on the route
  const isDoctorRoute = location.pathname.includes('/doctor');
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <div>
  {isDoctorRoute ? <DoctorHeader /> : <PatientHeader />}
  <div className="bg-[#fff] min-h-screen p-2 pt-24 flex">
    {!selectedUser || !isSmallScreen ? (
      <ChatList chatUsers={chatUsers} onSelectChat={handleSelectChat} chatLoading={loading} />
    ) : null}
    <ChatInterface selectedUser={selectedUser} />

    {selectedUser && isSmallScreen? <button onClick={() => setSelectedUesr(null)} className='absolute ml-96 right-9 top-[7.5rem] text-sm font-semibold'><CloseIcon/></button>: ''}
  </div>
</div>
  );
}

export default ChatHome;
