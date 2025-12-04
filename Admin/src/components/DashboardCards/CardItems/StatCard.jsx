const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-[#fdf5f7] rounded-3xl px-5 py-4 flex items-center gap-4 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
