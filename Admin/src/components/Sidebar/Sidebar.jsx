import SidebarMenuItem from "./MenuItems/SidebarMenuItem.jsx";
import UploadBox from "./UploadBox/UploadBox.jsx";

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#15151e] text-white px-6 py-6 space-y-6">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">Dokhan</div>

      {/* Profile */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img
            src="https://i.pravatar.cc/150?img=32"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <p className="font-semibold">Eleanor Pena</p>
          <p className="text-xs text-gray-400 mt-1">Good Morning!</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-2">
        <SidebarMenuItem label="Dashboard" icon="🏠" active />
        <SidebarMenuItem label="Order" icon="🧾" />
        <SidebarMenuItem label="Menu" icon="📋" />
        <SidebarMenuItem label="Customer" icon="👥" />
        <SidebarMenuItem label="Analytics" icon="📊" />
        <SidebarMenuItem label="Settings" icon="⚙️" />
      </nav>

      <UploadBox />
    </aside>
  );
};

export default Sidebar;
