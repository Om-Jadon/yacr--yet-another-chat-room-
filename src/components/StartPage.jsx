import React, { useState, useEffect } from "react";

function StartPage({
  username,
  setUsername,
  roomCode,
  setRoomCode,
  error,
  setError,
  createRoom,
  joinRoom,
}) {
  // Function to handle room creation
  const handleCreateRoom = () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    setError("");
    createRoom();
  };

  // Function to handle room joining
  const handleJoinRoom = () => {
    if (!username.trim() && !roomCode.trim()) {
      setError("Username and room code are required");
      return;
    }
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!roomCode.trim()) {
      setError("Room code is required");
      return;
    }
    setError("");
    joinRoom();
  };

  // UseEffect to clear error when user starts typing
  useEffect(() => {
    if (username.trim() && roomCode.trim()) {
      setError("");
    }
  }, [username, roomCode, setError]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black p-4">
      <div className="w-full max-w-lg p-4 sm:p-6 md:p-8 rounded-lg bg-opacity-40 backdrop-blur-lg bg-black text-white shadow-2xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            YACR
          </h1>
          <h2 className="text-xl md:text-2xl text-blue-400">
            (Yet Another Chat Room)
          </h2>
        </div>

        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-200 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4 md:space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-base md:text-lg font-medium text-gray-300"
            >
              Enter your Username
            </label>
            <input
              id="username"
              className="w-full p-2 md:p-3 mt-2 border border-gray-600 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. JohnDoe"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>

          <button
            className="w-full py-2 md:py-3 cursor-pointer bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>

          <div className="text-center text-sm md:text-base">OR</div>

          <div>
            <label
              htmlFor="roomCode"
              className="block text-base md:text-lg font-medium text-gray-300"
            >
              Join a Room
            </label>
            <div className="flex flex-col sm:flex-row items-center mt-2 gap-2">
              <input
                id="roomCode"
                className="w-full p-2 md:p-3 border border-gray-600 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <button
                className="w-full sm:w-auto p-2 md:p-3 bg-green-600 cursor-pointer text-white rounded-lg font-semibold hover:bg-green-700 transition mt-2 sm:mt-0"
                onClick={handleJoinRoom}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
