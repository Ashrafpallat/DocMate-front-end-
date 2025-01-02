import React, { useEffect, useState } from 'react';
import { HiChatAlt2 } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logoutDoctor } from '../../redux/doctorSlice';
import { RootState } from '../../redux/store';
import { doctorLogout } from '../../services/doctorServices';
import { getAllChats } from '../../services/ChatService';
import { useSocket } from '../../context/SocketContext';
import { incrementUnreadCount, setUnreadCounts } from '../../redux/notificationSlice';
import api from '../../services/axiosInstance';
const DoctorHeader: React.FC = () => {
    const socket = useSocket();
    const [chatRooms, setChatRooms] = useState([]);

    const profilePhoto = useSelector((state: RootState) => state.doctor.profilePhoto);
    const name = useSelector((state: RootState) => state.doctor.name);
    const totalUnreadCount = useSelector(
        (state: RootState) => state.notifications.totalUnreadCount
    );
    // Function to determine if a link is active
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleLogout = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            doctorLogout()
            dispatch(logoutDoctor());
        } catch (error) {
            console.log('error while logout API call', error);
        }
    };


    useEffect(() => {
        try {
            const fetchUnreadCounts = async () => {
                try {
                    // Fetch unread message counts for all chats in parallel
                    const responses = await Promise.all(
                        chatRooms.map((chatId) =>
                            api.get(`/chat/getUnread-messageCount/${chatId}`).then((response) => ({
                                chatId: chatId,
                                count: response.data,
                            }))
                        )
                    );

                    // Update state with the results
                    dispatch(setUnreadCounts(responses));

                } catch (error) {
                    console.error("Error fetching unread message counts:", error);
                }
            };
            fetchUnreadCounts()
        } catch (error) {

        }
    }, [chatRooms])

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const chatUsers = await getAllChats();
                const chatIds = chatUsers?.data?.map((chat: { _id: string; }) => chat._id); // Extract chat IDs
                setChatRooms(chatIds);
                console.log("Fetched chat rooms:", chatIds);
            } catch (error) {
                console.error("Error fetching chat rooms:", error);
            }
        };

        fetchChatRooms();
    }, []);



    useEffect(() => {
        if (!socket || chatRooms.length === 0) return;

        chatRooms.forEach((chatId) => {
            socket.emit("joinRoom", chatId);
            console.log(`Joined room from app: ${chatId}`);
        });
    }, [socket, chatRooms]);

    useEffect(() => {
        if (!socket) return;
        socket.on('receiveMessage', (message: { chatId: string; }) => {
            console.log('new message from app', message);
            const { chatId } = message;
            dispatch(incrementUnreadCount({ chatId }));
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [socket]);
  useEffect(()=>{
    if(!socket) return
    socket.on('receiveVideoCall', (data) => {
      console.log('Video call started:', data);
      // Example: Redirect to the video call page
      window.location.href = data.videoCallUrl;
    });
  },[socket])

    return (
        <header className="bg-black shadow-md py-6 px-8 flex justify-between items-center fixed w-full z-10">
            {/* Left Section: DocMate Title */}
            <div className={`text-2xl font-bold ${isActive('/doctor/dashboard') ? 'text-white' : 'text-gray-400'} hover:text-white`}>
                <Link to="/doctor/dashboard" title="Dashboard">
                    DocMate
                </Link>
            </div>

            {/* Right Section: Menu Items */}
            <nav className="flex items-center space-x-10 text-gray-400">
                {/* Navigation Options */}
                <Link
                    to="/doctor/appointments"
                    className={`hover:text-white flex items-center ${isActive('/doctor/appointments') ? 'text-white' : ''}`}
                >
                    Appointment
                </Link>

                <Link
                    to="/doctor/history"
                    className={`hover:text-white flex items-center ${isActive('/doctor/history') ? 'text-white' : ''}`}
                >
                    History
                </Link>

                <Link
                    to="/doctor/verify"
                    className={`hover:text-white flex items-center ${isActive('/doctor/verify') ? 'text-white ' : ''}`}
                >
                    Verification
                </Link>

                <Link
                    to="/doctor/manage-token"
                    className={`hover:text-white flex items-center ${isActive('/doctor/manage-token') ? 'text-white' : ''}`}
                >
                    Manage Token
                </Link>
                <Link
                    to="/doctor/reviews"
                    className={`hover:text-white flex items-center ${isActive('/doctor/reviews') ? 'text-white' : ''}`}
                >
                    Reveiws
                </Link>

                {/* Message Icon */}
                <div className="relative">
                    <Link
                        to="/doctor/chatHome"
                        className={`hover:text-white ${isActive('/doctor/chatHome') ? 'text-white' : ''}`}
                    >
                        <HiChatAlt2 size={28} />
                    </Link>
                    {totalUnreadCount > 0 && (
                        <span
                            className="absolute top-0 right-0 bg-[#996337] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                            style={{ transform: 'translate(50%, -50%)' }} // Slight offset to position the dot correctly
                        >
                            {totalUnreadCount}
                        </span>
                    )}
                </div>

                {/* Profile Icon with Dropdown */}
                <div className="relative" onClick={toggleDropdown}>
                    <button>
                        <img
                            src={profilePhoto || `https://dummyimage.com/100x100/09f/fff&text=${name}`} // Placeholder image
                            className="w-9 rounded-full object-cover" // Adjust size as needed
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                            <Link
                                to="/doctor/profile"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                            >
                                Profile
                            </Link>
                            <Link
                                to="/doctor/wallet"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                            >
                                Wallet
                            </Link>
                            <button
                                onClick={handleLogout} // Handle logout functionality
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default DoctorHeader;
