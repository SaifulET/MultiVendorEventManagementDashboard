import { FiLogOut } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import brandlogo from "../../assets/image/logo.svg";
import {
  AlignCenterVertical,
  ChartColumnIncreasing,
  Crown,
  Settings,
  TriangleAlert,
  Users,
} from "lucide-react";
import { BsBadgeAd } from "react-icons/bs";
import { SiActivitypub } from "react-icons/si";
import { GiMushroomHouse } from "react-icons/gi";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: <MdDashboard className="w-5 h-5" />,
      label: "Dashboard",
      Link: "/",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "User List",
      Link: "/user-list",
    },
    {
      icon: <ChartColumnIncreasing className="w-5 h-5" />,
      label: "Earnings",
      Link: "/earnings",
    },
    {
      icon: <Crown className="w-5 h-5" />,
      label: "Subscriptions",
      Link: "/subscriptions",
    },
    {
      icon: <GiMushroomHouse className="w-5 h-5"/>,
      label: "Venue & Service",
      Link: "/venueandService",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Create Admin",
      Link: "/createAdmin",
    },

   
    {
      icon: <TriangleAlert className="w-5 h-5" />,
      label: "Reports",
      Link: "/reports",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      Link: "/settings",
    },
  ];

  return (
    <div className="flex flex-col h-auto p-3 w-72">
      <div className="mx-auto">
        <img src={brandlogo} alt="logo" className="w-40 h-40" />
      </div>

      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-150px)]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.Link;

          return (
            <div key={item.label}>
              <div
                className={`flex justify-between items-center px-5 py-2 my-5 cursor-pointer transition-all hover:bg-[#B74140] hover:text-white hover:font-semibold ${
                  isActive
                    ? "bg-[#B74140] text-white font-semibold"
                    : "text-black"
                }`}
              >
                <Link to={item.Link} className="flex items-center w-full gap-3">
                  {item.icon}
                  <p>{item.label}</p>
                  {item.isDropdown && (
                    <BiChevronDown
                      className={`${isActive ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20">
        <Link to="/sign-in">
          <div className="flex items-center justify-start w-full py-3 text-xl text-red-500 rounded-lg cursor-pointer">
            <FiLogOut className="text-xl" />
            <p className="ml-2">Log out</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
