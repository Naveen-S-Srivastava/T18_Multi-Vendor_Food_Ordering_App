import { trendingMenus } from "../../../utils/dummyData.js";

const TrendingMenus = () => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Daily Trending Menus</h2>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <span>Item name</span>
        <span>Orders</span>
      </div>

      <div className="space-y-3">
        {trendingMenus.map((item, idx) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/trend${idx}/80/80`}
                  alt={item.item}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.item}
                </p>
                <p className="text-[11px] text-gray-400">{item.price}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {item.orders}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingMenus;
