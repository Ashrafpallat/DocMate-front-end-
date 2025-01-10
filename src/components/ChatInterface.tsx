import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext'; // Import the useSocket hook
import SendIcon from '@mui/icons-material/Send';
import chatBg from '../assets/chat-bg.png';
import { BarLoader } from 'react-spinners';
import Lottie from 'react-lottie';
import TypingAnimation from '../assets/Typing-animation.json';
import { fetchOrCreateChat, getMyMessages, sendMyMessage } from '../services/ChatService';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import { useNavigate } from 'react-router-dom';
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

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: TypingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedUser }) => {

  const navigate = useNavigate()
  const socket = useSocket(); // Get the socket instance from the context
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chatDetails, setChatDetails] = useState<IChatDetails | undefined>();
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('typing', () => setIsTyping(true));
    socket.on('stopTyping', () => setIsTyping(false));
    socket.on('receiveMessage', (message) => {
      setChatHistory((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('receiveMessage');
    };
  }, [socket]);

  const fetchChat = async (selectedUserId: string) => {
    try {
      setLoading(true);
      const response = await fetchOrCreateChat(selectedUserId);
      setChatDetails(response?.data);

      const getMessages = await getMyMessages(response?.data._id);
      setChatHistory(getMessages?.data);

      if (response?.data._id) {
        socket?.emit('joinRoom', response?.data._id);
      }
    } catch (error) {
      console.error('Error fetching or creating chat:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchChat(selectedUser._id);
    }

    return () => {
      if (chatDetails?._id) {
        socket?.emit('leaveRoom', chatDetails._id);
      }
    };
  }, [selectedUser, socket]);

  const sendMessage = async () => {
    try {
      const chatId = chatDetails?._id;
      const receiver = selectedUser?._id;

      const response = await sendMyMessage(chatId, receiver, content);
      socket?.emit('sendMessage', response?.data);
      setChatHistory([...chatHistory, response?.data]);
      setContent('');
    } catch (error) {
      console.log('Error sending message', error);
    }
  };

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const typingHandler = (e: any) => {
    setContent(e.target.value);

    if (!socket || !chatDetails?._id) return;

    socket.emit('typing', chatDetails._id);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit('stopTyping', chatDetails._id);
    }, 1000);

    setTypingTimeout(timeout);
  };

  const triggerVideoCall = () => {
    const chatId = chatDetails?._id; // Assuming chatDetails contains the chatId
    navigate('/video-call', { state: { chatId } });

  }

  return (
    
    <div
      className={`flex-1 bg-[#FAF9F6] flex flex-col items-center justify-center rounded-lg ml-4 min-w-80 ${
        selectedUser ? "block" : "hidden"
      } sm:flex`}
      style={{
        backgroundImage: `url(${chatBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {selectedUser ? (
        <div className="w-full h-full flex flex-col">
          <div className="p-4 bg-gray-50 shadow-sm flex items-center gap-4 border-t-2">
            <img
              src={selectedUser.profilePhoto}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
            <button onClick={triggerVideoCall}>
              <VideoCallOutlinedIcon fontSize='large' />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto ">
            {loading ? (
              <div className="flex justify-center items-center w-full h-full">
                <BarLoader color="#996337" />
              </div>
            ) : (
              <div>
                {chatHistory.length > 0 ? (
                  chatHistory.map((message) => (
                    <div
                      key={message._id}
                      className={`flex items-start my-2 ${message.sender === selectedUser._id
                        ? 'justify-start'
                        : 'justify-end'
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
                {isTyping && <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />}
              </div>
            )}
          </div>
          <div className="p-4 flex bg-gray-50 shadow-lg">
            <input
              type="text"
              value={content}
              onChange={typingHandler}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && content.trim() !== '') {
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="w-full border  rounded-md p-2 focus:outline-none"
            />
            <button className="p-3" onClick={sendMessage}>
              <SendIcon />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-lg">Select a chat to start a conversation</p>
      )}
    </div>
  );
};

export default ChatInterface;
