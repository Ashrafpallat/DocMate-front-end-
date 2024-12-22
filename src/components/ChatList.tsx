import React, { useState } from 'react';
import api from '../services/axiosInstance';
import { getPatientHistory } from '../services/patientServices';

interface ChatListItem {
  _id: string;
  name: string;
  profilePhoto: string;
  lastMessage: string; // To show the last sent message
}

interface Doctor {
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
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await getPatientHistory() // Replace with your API endpoint
      console.log('patient historyr response.data', response?.data);

      setDoctors(response?.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  const handleDoctorSelect = async (doctor: Doctor) => {
    try {
      // const response = await api.post('/chat/fetchOrCreateChat', {
      //   user1: doctor.doctorId._id, // Adjust the API payload as needed
      // });

      const newChatUser = {
        _id: doctor.doctorId._id,
        name: doctor.doctorId.name,
        profilePhoto: doctor.doctorId.profilePhoto,
        lastMessage: '', // Add actual last message if needed
      };

      // Pass the chat to the parent component
      onSelectChat(newChatUser);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="w-1/3 bg-[#FAF9F6] p-4 shadow-md rounded-lg relative">
      <h2 className="text-lg font-semibold mb-4">chatUsers</h2>
      {chatUsers.length > 0 ? (
        <ul>
          {chatUsers.map((chatUser) => (
            <li
              key={chatUser._id}
              onClick={() => onSelectChat(chatUser)}
              className="flex items-center gap-4 p-3 mb-2 hover:bg-[#ece9e2] cursor-pointer rounded-md"
            >
              <img
                src={chatUser.profilePhoto}
                alt={chatUser.name}
                className="w-12 h-12 rounded-full object-cover"
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
        className="absolute bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Select a Doctor</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors..."
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
            />
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <ul>
                {doctors
                  .filter((doctor) =>
                    doctor?.doctorId.name?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((doctor) => (
                    <li
                      key={doctor.doctorId._id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className="flex items-center gap-4 p-3 mb-2 hover:bg-gray-100 cursor-pointer rounded-md"
                    >
                      <img
                        src={doctor.doctorId.profilePhoto}
                        alt={doctor.doctorId.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <h3 className="text-sm font-medium">{doctor.doctorId.name}</h3>
                    </li>
                  ))}
              </ul>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white p-2 rounded-md w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;
