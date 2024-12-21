import React, { useEffect, useState } from 'react';
import api from '../services/axiosInstance';
import toast from 'react-hot-toast';

interface ChatInterfaceProps {
  selectedChat: {
    _id: string;
    name: string;
    profilePhoto: string;
  } | null;
}
interface IChatDetails{
  _id: string
  doctor: string
}
const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedChat }) => {
  const [chatHistory, setChatHistory] = useState<string | null>(""); // To store chat history
  const [loading, setLoading] = useState<boolean>(false); // To manage loading state
  const [chatDetails, setChatDetails] = useState<IChatDetails>()
  const [content, setContent] = useState('')
  // Fetch or create a chat when a chat is selected
  const fetchChat = async (selectedChatId: string) => {
    try {
      setLoading(true);
      // Replace with the correct API endpoint
      const response = await api.post(`/chat/fetchOrCreateChat`, {
        user1: selectedChatId, // You can replace this with the selected chat's ID
      });
      console.log('chat interface response.data',response.data);
      setChatDetails(response.data)
      setChatHistory(response.data.messages); // Assuming the API returns chat messages
      setLoading(false);
    } catch (error) {
      console.error("Error fetching or creating chat:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedChat) {
      fetchChat(selectedChat._id); // Fetch chat when a chat is selected
    }
  }, [selectedChat]);
  const sendMessage = async()=>{
    try {
      // chatId, receiver, content
      const chatId = chatDetails?._id
      const receiver = chatDetails?.doctor
      console.log('c id', chatId, 'rcver',receiver, 'cntnt', content);
      
      const response = await api.post('/chat/send-message', {chatId, receiver, content})
      if(response.status === 200){
        toast.success('meesage sent success')
      }
    } catch (error) {
      console.log('erro sending message',error);
    }
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center rounded-lg ml-4">
      {selectedChat ? (
        <div className="w-full h-full flex flex-col">
          <div className="p-4 bg-white shadow-sm flex items-center gap-4">
            <img
              src={selectedChat.profilePhoto}
              alt={selectedChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <h2 className="text-lg font-semibold">{selectedChat.name}</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500">Loading chat...</p>
            ) : (
              <div>
                {/* Render messages here */}
                {chatHistory ? (
                  <div>
                    {/* Loop through messages and render them */}
                    <p>{chatHistory}</p>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No messages yet.</p>
                )}
              </div>
            )}
          </div>
          <div className="p-4 bg-white shadow-sm">
            <input
              type="text"
              value={content}
              onChange={(e)=> setContent(e.target.value)}
              placeholder="Type a message..."
              className="w-full border border-gray-300 rounded-md p-2"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-lg">Select a chat to start a conversation</p>
      )}
    </div>
  );
};

export default ChatInterface;
