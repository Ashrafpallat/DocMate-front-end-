import React from 'react';

interface ChatInterfaceProps {
  selectedChat: {
    _id: string;
    name: string;
    profilePhoto: string;
  } | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedChat }) => {
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
            {/* Messages will go here */}
            <p className="text-center text-gray-500">Chat history will appear here...</p>
          </div>
          <div className="p-4 bg-white shadow-sm">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-lg">Select a chat to start a conversation</p>
      )}
    </div>
  );
};

export default ChatInterface;
