import StatCard from "./CardItems/StatCard.jsx";
import { statCards } from "../../utils/dummyData.js";

const StatCardGroup = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {statCards.map((card) => (
        <StatCard
          key={card.id}
          icon={card.icon}
          label={card.label}
          value={card.value}
        />
      ))}
    </div>
  );
};

export default StatCardGroup;
