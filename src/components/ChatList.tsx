import React from 'react';

interface ChatListItem {
  _id: string;
  name: string;
  profilePhoto: string;
  lastMessage: string; // To show the last sent message
}

interface ChatListProps {
  chats: ChatListItem[];
  onSelectChat: (chat: ChatListItem) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat }) => {
  return (
    <div className="w-1/3 bg-[#FAF9F6] p-4 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>
      {chats.length > 0 ? (
        <ul>
          {chats.map((chat) => (
            <li
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className="flex items-center gap-4 p-3 mb-2 hover:bg-[#ece9e2] cursor-pointer rounded-md"
            >
              <img
                src={chat.profilePhoto}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium">{chat.name}</h3>
                <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No chats found.</p>
      )}
    </div>
  );
};

export default ChatList;
