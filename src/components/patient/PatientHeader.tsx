import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutPatient } from "../../redux/patientSlice";
import { RootState } from "../../redux/store";
import { HiChatAlt2, HiMenuAlt3 } from "react-icons/hi";
import { patientLogout } from "../../services/patientServices";
import { getAllChats } from "../../services/ChatService";
import { incrementUnreadCount, setUnreadCounts } from "../../redux/notificationSlice";
import { useSocket } from "../../context/SocketContext";
import api from "../../services/axiosInstance";
import toast from "react-hot-toast";

const PatientHeader: React.FC = () => {
  const socket = useSocket();

  const [chatRooms, setChatRooms] = useState([]);
  const profilePhoto = useSelector((state: RootState) => state.patient.profilePhoto);
  const name = useSelector((state: RootState) => state.patient.name);
  const totalUnreadCount = useSelector(
    (state: RootState) => state.notifications.totalUnreadCount
  );
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  // Get the current route to determine the active tab
  const location = useLocation();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = async () => {
    try {
      patientLogout()
      dispatch(logoutPatient());
    } catch (error) {
      console.error("Error during logout", error);
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
        if(!chatIds){
          toast.error('Unexpected error')
        }
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
      // window.location.href = data.videoCallUrl;
    });
  },[socket])

  return (
    <header className="bg-black text-gray-400 p-6 flex justify-between items-center fixed w-full z-10">
  {/* DocMate logo/text on the left side */}
  <Link
    to="/patient/home"
    className={`hover:text-white active:text-white ${location.pathname === "/patient/home" ? "text-white" : ""}`}
  >
    <div className="text-2xl font-bold">DocMate</div>
  </Link>

  {/* Desktop Navigation links */}
  <nav className="hidden md:flex space-x-10 items-center">
    <Link
      to="/patient/appointments"
      className={`hover:text-white ${location.pathname === "/patient/appointments" ? "text-white" : ""}`}
    >
      Appointments
    </Link>
    <Link
      to="/patient/history"
      className={`hover:text-white ${location.pathname === "/patient/history" ? "text-white" : ""}`}
    >
      History
    </Link>
    <Link
      to="/patient/chatHome"
      className={`hover:text-white ${location.pathname === "/patient/chatHome" ? "text-white" : ""} flex items-center relative`}
    >
      <HiChatAlt2 size={28} />
      {totalUnreadCount > 0 && (
        <span
          className="absolute top-0 right-0 w-5 h-5 bg-[#996337] text-white text-xs flex items-center justify-center rounded-full"
          style={{ transform: 'translate(50%, -50%)' }}
        >
          {totalUnreadCount}
        </span>
      )}
    </Link>

    <div onClick={toggleDropdown} className="relative">
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
            to="/patient/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </nav>

  {/* Mobile Hamburger Menu */}
  <div className="md:hidden flex items-center space-x-4">
    <button onClick={toggleMobileMenu} className="text-gray-400 hover:text-white">
      <HiMenuAlt3 size={28} />
    </button>
  </div>

  {/* Mobile Menu */}
  {isMobileMenuOpen && (
    <div className="md:hidden absolute top-16 left-0 w-full bg-black text-white py-4 px-8 space-y-4">
      <Link to="/patient/appointments" className="block">Appointments</Link>
      <Link to="/patient/history" className="block">History</Link>
      <Link to="/patient/chatHome" className="block">Chat</Link>
      <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 "
          >
            Logout
          </button>
      <div className="flex items-center space-x-2">
        <img
          src={profilePhoto || `https://dummyimage.com/100x100/09f/fff&text=${name}`}
          className="w-9 rounded-full object-cover"
        />
        <Link to="/patient/profile" className="block px-4 py-2">Profile</Link>
      </div>
    </div>
  )}
</header>

  );
};

export default PatientHeader;
