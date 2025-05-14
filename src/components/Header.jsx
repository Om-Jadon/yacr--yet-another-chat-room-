import { useState } from "react";

export default function Header({
  roomCode,
  leaveRoom,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const [copyMessage, setCopyMessage] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopyMessage("Copied!");
      setTimeout(() => setCopyMessage(""), 2000); // Clear message after 2 seconds
    });
  };

  return (
    <div className="flex sm:flex-row justify-between sm:items-center gap-2 sm:gap-0 bg-black bg-opacity-30 backdrop-blur-lg p-3 md:p-4 shadow rounded-xl text-white border border-gray-700">
      <div className="font-medium flex items-center space-x-2 text-sm md:text-base">
        {/* Mobile sidebar toggle button */}
        <button
          className="md:hidden p-2 bg-blue-600 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
        <span>Room:</span>
        <span
          className="font-mono text-blue-400 cursor-pointer hover:text-blue-300"
          onClick={copyToClipboard}
          title="Click to copy room code"
        >
          {roomCode}
        </span>
        {copyMessage && (
          <span className="text-green-400 text-xs md:text-sm">
            {copyMessage}
          </span>
        )}
      </div>
      <button
        className="px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white text-sm md:text-base rounded-lg hover:bg-red-700 transition"
        onClick={leaveRoom}
      >
        Leave Room
      </button>
    </div>
  );
}
