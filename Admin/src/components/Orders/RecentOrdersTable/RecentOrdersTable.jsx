import { recentOrders } from "../../../utils/dummyData.js";

const StatusBadge = ({ status }) => {
  const isPending = status === "Pending";
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        isPending
          ? "bg-purple-100 text-purple-600"
          : "bg-green-100 text-green-600"
      }`}
    >
      {status}
    </span>
  );
};

const RecentOrdersTable = () => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Recent Order Request</h2>
        <button className="text-xs text-gray-500">Monthly ▾</button>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="text-xs text-gray-400">
          <tr>
            <th className="pb-2">Item Name</th>
            <th className="pb-2">Order Location</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Qta</th>
            <th className="pb-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="text-xs sm:text-sm">
          {recentOrders.map((order, idx) => (
            <tr key={order.id} className="border-t border-gray-100">
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/order${idx}/80/80`}
                      alt={order.item}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {order.item}
                    </p>
                    <p className="text-gray-400 text-[11px]">{order.id}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 text-gray-500">{order.location}</td>
              <td className="py-3">{order.price}</td>
              <td className="py-3">{order.qty}</td>
              <td className="py-3 text-right">
                <StatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;
