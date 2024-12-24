import React, { useEffect, useState } from 'react';
import api from '../services/axiosInstance';
import SendIcon from '@mui/icons-material/Send';
import chatBg from '../assets/chat-bg.png'
import { BarLoader } from 'react-spinners';

import { io } from 'socket.io-client';

const socket = io("http://localhost:5000", {
  reconnectionAttempts: 5, // Limit to 5 attempts
  reconnectionDelay: 1000, // 1 second delay between attempts
});
interface ChatInterfaceProps {
  selectedUser: {
    _id: string;
    name: string;
    profilePhoto: string;
  } | null;
}

interface IChatDetails {
  _id: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedUser }) => {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chatDetails, setChatDetails] = useState<IChatDetails | undefined>();
  const [content, setContent] = useState('');
  useEffect(() => {
    // Listen for incoming messages once
    socket.on('receiveMessage', (message) => {
      setChatHistory((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Cleanup: remove listener on component unmount
      socket.off('receiveMessage');
    };
  }, []);

  const fetchChat = async (selectedUserId: string) => {
    try {
      setLoading(true);
      const response = await api.post(`/chat/fetchOrCreateChat`, { user1: selectedUserId });
      console.log('chat interface response.data', response.data);
      setChatDetails(response.data);

      const getMessages = await api.get(`/chat/${response.data._id}`);
      console.log('chat interface getMessages.data', getMessages.data);
      setChatHistory(getMessages.data);
      setLoading(false);

      if (response.data._id) {
        socket.emit('joinRoom', response.data._id);
      }
    } catch (error) {
      console.error('Error fetching or creating chat:', error);
      setLoading(false);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchChat(selectedUser._id);
    }

    return () => {
      // Cleanup: leave the room when component unmounts or selectedUser changes
      if (chatDetails?._id) {
        socket.emit('leaveRoom', chatDetails._id);
      }
    };
  }, [selectedUser]);

  const sendMessage = async () => {
    try {
      const chatId = chatDetails?._id;
      const receiver = selectedUser?._id;
      const response = await api.post('/chat/send-message', { chatId, receiver, content });
      socket.emit('sendMessage', response.data);
      setChatHistory([...chatHistory, response.data]);
      setContent('');
    } catch (error) {
      console.log('Error sending message', error);
    }
  };



  return (
    <div
      className="flex-1 bg-[#FAF9F6] flex flex-col items-center justify-center rounded-lg ml-4"
      style={{
        backgroundImage: `url(${chatBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >      {selectedUser ? (
      <div className="w-full h-full flex flex-col">
        <div className="p-4 bg-gray-50 shadow-sm flex items-center gap-4 border-t-2">
          <img
            src={selectedUser.profilePhoto}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            // <p className="text-center text-gray-500">Loading chat...</p>
            <div className="flex justify-center items-center w-full h-full">
              <BarLoader color="#fff"  />
            </div>
          ) : (
            <div>
              {/* Example: Render chat history */}
              {chatHistory.length > 0 ? (
                chatHistory.map((message) => (
                  <div
                    key={message._id}
                    className={`flex items-start my-2 ${message.sender === selectedUser._id
                      ? 'justify-start' // Message from the selected chat (left side)
                      : 'justify-end'   // Message to the selected chat (right side)
                      }`}
                  >
                    <div
                      className={`flex flex-col ${message.sender === selectedUser._id ? 'bg-white shadow' : 'bg-[#D8FDD2] shadow  text-black'
                        } p-2 rounded-2xl max-w-xs`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>
          )}
        </div>
        <div className="p-4 flex bg-gray-50 shadow-lg">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && content.trim() !== '') {
                sendMessage(); // Call the sendMessage function
              }
            }}
            placeholder="Type a message..."
            className="w-full border  rounded-md p-2 focus:outline-none"
          />
          <button className='p-3' onClick={sendMessage}><SendIcon /></button>
        </div>
      </div>
    ) : (
      <p className="text-gray-400 text-lg">Select a chat to start a conversation</p>
    )}
    </div>
  );
};

export default ChatInterface;
