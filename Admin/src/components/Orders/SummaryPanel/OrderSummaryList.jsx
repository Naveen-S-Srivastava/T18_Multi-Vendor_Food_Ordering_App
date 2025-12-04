import { orderSummary } from "../../../utils/dummyData.js";

const OrderSummaryList = () => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Order summary</h2>
        <button className="text-xs text-gray-500">Monthly ▾</button>
      </div>

      <div className="space-y-3 text-sm">
        {orderSummary.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl px-3 py-2"
            style={{ backgroundColor: item.color }}
          >
            <span className="text-gray-700">{item.label}</span>
            <span className="font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummaryList;
