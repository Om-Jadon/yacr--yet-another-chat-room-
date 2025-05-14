import Avatar from "./Avatar";

function SideBar({ members, username }) {
  return (
    <div className="w-full h-full p-3 md:p-4 bg-black bg-opacity-30 backdrop-blur-lg border-r border-gray-700 shadow-inner text-white flex flex-col">
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between">
          <h1 className="text-xl md:text-2xl font-extrabold text-blue-400 tracking-wide">
            YACR
          </h1>
        </div>
        <p className="text-xs md:text-sm text-gray-400 italic">
          Yet Another Chat Room
        </p>
      </div>

      <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4 text-gray-300">
        Members ({members.length})
      </h2>

      <div className="flex-1 overflow-y-auto pr-1">
        <ul className="space-y-2 md:space-y-3">
          {members.map((member) => (
            <li
              key={member}
              className={`flex items-center gap-2 p-1 md:p-2 rounded-md ${
                member === username
                  ? "bg-blue-800 bg-opacity-30"
                  : "hover:bg-gray-700"
              }`}
            >
              <Avatar username={member} />
              <span className="truncate text-xs md:text-sm">
                {member}
                {member === username && (
                  <span className="text-xs text-white ml-1">(You)</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
