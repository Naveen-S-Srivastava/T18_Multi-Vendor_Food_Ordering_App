const UploadBox = () => {
  return (
    <div className="mt-auto bg-[#1f1f27] rounded-3xl p-4 flex flex-col items-center text-center space-y-3">
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-400 to-red-400 flex items-center justify-center text-4xl">
        🍔
      </div>
      <p className="text-sm text-gray-200 font-medium">
        Share your own recipe with the community
      </p>
      <button className="mt-1 px-4 py-2 rounded-full bg-white text-sm font-semibold text-gray-900">
        Upload Now
      </button>
    </div>
  );
};

export default UploadBox;
