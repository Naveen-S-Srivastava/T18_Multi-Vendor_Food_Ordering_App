import Sidebar from "../components/Sidebar/Sidebar.jsx";
import TopNavbar from "../components/Navbar/TopNavbar.jsx";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#f5f5f7]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <main className="flex-1 p-6 lg:p-8 bg-[#f5f5f7] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
