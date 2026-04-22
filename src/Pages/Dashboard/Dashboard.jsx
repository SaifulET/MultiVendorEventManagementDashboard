import { useEffect } from "react";
import RecentUsersTable from "../../Components/Dashboard/RecentUsersTable";
import UserRatioChart from "../../Components/Dashboard/UserRatioChart";
import useAdminAnalyticsStore from "../../store/useAdminAnalyticsStore";

const formatCompactNumber = (value) => {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
};

const Dashboard = () => {
  const overview = useAdminAnalyticsStore((state) => state.overview);
  const fetchOverview = useAdminAnalyticsStore((state) => state.fetchOverview);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const stats = [
    {
      label: "Total Clients",
      value: overview.totalClients,
    },
    {
      label: "Total Venue Provider",
      value: overview.totalVenueProviders,
    },
    {
      label: "Total Service Provider",
      value: overview.totalServiceProviders,
    },
    {
      label: "Total Revenue",
      value: overview.totalRevenue,
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="p-4 mx-auto mt-16 ">
        <div>
          <div
            
            className=" border border-1 border-gray-200 flex flex-wrap p-5 my-[30px] rounded-md justify-evenly md:flex-nowrap"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`bg-[##f6f6f6] flex justify-center w-1/4 ${
                  index < stats.length - 1 ? "border-r border-gray-700" : ""
                }`}
              >
                <div className="flex flex-col gap-5">
                  <p className="text-[#1C2434] text-2xl font-bold">
                    {formatCompactNumber(stat.value)}
                  </p>
                  <p className="text-xl text-[#101010] font-semibold">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div >
            <UserRatioChart />
          </div>
          <div>
            <RecentUsersTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
