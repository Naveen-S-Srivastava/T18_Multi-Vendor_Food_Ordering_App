import { FiBell, FiMail } from "react-icons/fi";

const TopNavbar = () => {
  return (
    <header className="w-full flex items-center justify-between px-6 lg:px-8 py-4 bg-white border-b border-gray-100">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search here"
            className="w-full rounded-full bg-[#f5f5f7] pl-4 pr-4 py-2 text-sm outline-none border border-transparent focus:border-gray-300"
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4 ml-4">
        <button className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center">
          <FiBell className="text-gray-600" />
        </button>
        <button className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center">
          <FiMail className="text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
