import StatCardGroup from "../components/DashboardCards/StatCardGroup.jsx";
import RevenueChart from "../components/Charts/RevenueChart/RevenueChart.jsx";
import OrderSummaryList from "../components/Orders/SummaryPanel/OrderSummaryList.jsx";
import RecentOrdersTable from "../components/Orders/RecentOrdersTable/RecentOrdersTable.jsx";
import TrendingMenus from "../components/Orders/TrendingMenus/TrendingMenus.jsx";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        Dashboard
      </h1>

      {/* Top stats */}
      <StatCardGroup />

      {/* Middle row: Chart + Order summary */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <RevenueChart />
        </div>
        <div className="xl:col-span-4">
          <OrderSummaryList />
        </div>
      </div>

      {/* Bottom row: Recent orders + Trending */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <RecentOrdersTable />
        </div>
        <div className="xl:col-span-4">
          <TrendingMenus />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
