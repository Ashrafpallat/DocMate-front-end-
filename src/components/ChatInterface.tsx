import React, { useEffect, useState } from 'react';
import api from '../services/axiosInstance';
import toast from 'react-hot-toast';

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
  const [chatHistory, setChatHistory] = useState<any[]>([]); // Added any[] for better type handling
  const [loading, setLoading] = useState<boolean>(false);
  const [chatDetails, setChatDetails] = useState<IChatDetails | undefined>();
  const [content, setContent] = useState('');
  // console.log('selected uesr',selectedUser);
  
  const fetchChat = async (selectedUserId: string) => {
    try {
      setLoading(true);
      
      const response = await api.post(`/chat/fetchOrCreateChat`, {
        user1: selectedUserId,
      });
      console.log('chat interface response.data', response.data);
      setChatDetails(response.data);

      const getMessages = await api.get(`/chat/${response.data._id}`);
      console.log('chat interface getMessages.data',getMessages.data);
      
      setChatHistory(getMessages.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching or creating chat:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchChat(selectedUser._id);
    }
  }, [selectedUser]);

  const sendMessage = async () => {
    try {
      const chatId = chatDetails?._id;
      const receiver = selectedUser?._id;
      const response = await api.post('/chat/send-message', { chatId, receiver, content });
      if (response.status === 200) {
        setContent('');
        toast.success('Message sent successfully');
      }
    } catch (error) {
      console.log('Error sending message', error);
    }
  };
  

  return (
    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center rounded-lg ml-4">
      {selectedUser ? (
        <div className="w-full h-full flex flex-col">
          <div className="p-4 bg-white shadow-sm flex items-center gap-4">
            <img
              src={selectedUser.profilePhoto}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500">Loading chat...</p>
            ) : (
              <div>
                {/* Example: Render chat history */}
                {chatHistory.length > 0 ? (
                  chatHistory.map((message) => (
                    <div
                      key={message._id}
                      className={`flex items-start my-2 ${
                        message.sender === selectedUser._id
                          ? 'justify-start' // Message from the selected chat (left side)
                          : 'justify-end'   // Message to the selected chat (right side)
                      }`}
                    >
                      <div
                        className={`flex flex-col ${
                          message.sender === selectedUser._id ? 'bg-gray-200' : 'bg-blue-500 text-white'
                        } p-3 rounded-lg max-w-xs`}
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
          <div className="p-4 bg-white shadow-sm">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
