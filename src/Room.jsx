import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ref,
  onValue,
  push,
  set,
  remove,
  onDisconnect,
  get,
} from "firebase/database";
import { db } from "./firebase";
import ChatWindow from "./components/ChatWindow";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

export default function Room() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const hasPrompted = useRef(false);
  const [membersLoaded, setMembersLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Load members first
  useEffect(() => {
    const memRef = ref(db, `rooms/${roomCode}/members`);
    const unsubscribeMembers = onValue(memRef, (snapshot) => {
      const data = snapshot.val() || {};
      setMembers(Object.keys(data));
      setMembersLoaded(true);
    });

    return () => unsubscribeMembers();
  }, [roomCode]);

  // Prompt for username after members load
  useEffect(() => {
    if (!membersLoaded || username || hasPrompted.current) return;

    hasPrompted.current = true;

    let name = prompt("Enter your username:");
    if (!name || !name.trim()) {
      navigate("/");
      return;
    }

    name = name.trim();

    // Ensure unique
    let finalName = name;
    let i = 1;
    while (members.includes(finalName)) {
      finalName = `${name}${i}`;
      i++;
    }

    localStorage.setItem("username", finalName);
    setUsername(finalName);
  }, [membersLoaded, username, members, navigate]);

  // Once username is ready, connect to Firebase
  useEffect(() => {
    if (!username) return;

    const userRef = ref(db, `rooms/${roomCode}/members/${username}`);
    set(userRef, true);
    onDisconnect(userRef).remove();

    const msgRef = ref(db, `rooms/${roomCode}/messages`);
    const unsubscribeMessages = onValue(msgRef, (snapshot) => {
      const data = snapshot.val() || {};
      const messagesArray = Object.entries(data).map(([id, msg]) => ({
        id,
        ...msg,
      }));
      setMessages(messagesArray.sort((a, b) => a.timestamp - b.timestamp));
    });

    return () => unsubscribeMessages();
  }, [roomCode, username]);

  const sendMessage = (text) => {
    push(ref(db, `rooms/${roomCode}/messages`), {
      user: username,
      text,
      timestamp: Date.now(),
    });
  };

  const leaveRoom = async () => {
    const userRef = ref(db, `rooms/${roomCode}/members/${username}`);
    await remove(userRef);
    onDisconnect(userRef).cancel();
    localStorage.removeItem("username");

    const snapshot = await get(ref(db, `rooms/${roomCode}/members`));
    if (!snapshot.exists()) {
      await remove(ref(db, `rooms/${roomCode}`));
    }

    navigate("/");
  };

  if (!username) return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div
        ref={sidebarRef}
        className={`fixed w-3/5 md:static md:block z-40 md:w-1/4 lg:w-1/5 h-full transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <SideBar
          members={members}
          username={username}
          sSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-3 md:p-4 lg:p-6 space-y-2 md:space-y-4 ml-0  lg:ml-0 w-full md:w-3/4 lg:w-4/5">
        <Header
          roomCode={roomCode}
          leaveRoom={leaveRoom}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 bg-black bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
          <ChatWindow
            messages={messages}
            username={username}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
