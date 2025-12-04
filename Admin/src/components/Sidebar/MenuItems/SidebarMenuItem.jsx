import { FiChevronRight } from "react-icons/fi";

const SidebarMenuItem = ({ icon, label, active }) => {
  return (
    <button
      className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition 
      ${
        active
          ? "bg-[#2c2c36] text-white"
          : "text-gray-300 hover:bg-[#2c2c36] hover:text-white"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </span>
      {["Order", "Menu"].includes(label) && (
        <FiChevronRight className="text-xs opacity-60" />
      )}
    </button>
  );
};

export default SidebarMenuItem;
