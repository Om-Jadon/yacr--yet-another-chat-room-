import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import StartPage from "./components/StartPage";

export default function App() {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Helper to generate a unique username within a room
  const getUniqueUsername = async (baseName, room) => {
    const snapshot = await get(ref(db, `rooms/${room}/members`));
    const members = snapshot.exists() ? Object.keys(snapshot.val()) : [];

    let finalName = baseName.trim();
    let counter = 1;
    while (members.includes(finalName)) {
      finalName = `${baseName.trim()}${counter}`;
      counter++;
    }
    return finalName;
  };

  const createRoom = async () => {
    if (!username.trim()) return setError("Please enter a username");

    const code = uuidv4().slice(0, 6);
    const finalUsername = await getUniqueUsername(username, code);

    await set(ref(db, `rooms/${code}/members/${finalUsername}`), true);
    localStorage.setItem("username", finalUsername);
    navigate(`/room/${code}`);
  };

  const joinRoom = async () => {
    if (!username.trim() || !roomCode.trim())
      return setError("Fill both fields");

    // Check if the room exists
    const roomSnapshot = await get(ref(db, `rooms/${roomCode}`));
    if (!roomSnapshot.exists()) {
      return setError("Room does not exist. Please check the room code.");
    }

    // If room exists, generate a unique username for the user in that room
    const finalUsername = await getUniqueUsername(username, roomCode);

    await set(ref(db, `rooms/${roomCode}/members/${finalUsername}`), true);
    localStorage.setItem("username", finalUsername);
    navigate(`/room/${roomCode}`);
  };

  return (
    <StartPage
      username={username}
      setUsername={setUsername}
      roomCode={roomCode}
      setRoomCode={setRoomCode}
      error={error}
      setError={setError}
      createRoom={createRoom}
      joinRoom={joinRoom}
    />
  );
}
