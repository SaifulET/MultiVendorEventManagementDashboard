import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/Main/Main";
import SignIn from "../Pages/Auth/SignIn/SignIn";
import ForgatePassword from "../Pages/Auth/ForgatePassword/ForgatePassword";
import AboutUs from "../Pages/Settings/AboutUS/AboutUs";
import PrivacyPolicy from "../Pages/Settings/PrivacyPolicy/PrivacyPolicy";
import TermsCondition from "../Pages/Settings/TermsCondition/TermsCondition";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Pages/Dashboard/Dashboard";
import ProfilePage from "../Pages/AdminProfile/ProfilePage";
import VerifyCode from "../Pages/Auth/VerifyCode/VerifyCode";
import NewPass from "../Pages/Auth/NewPass/NewPass";
import Notifications from "../Pages/Notifications/Notifications";
import AnalysisPage from "../Pages/Analysis/AnalysisPage";
import Subscriptions from "../Pages/Subscriptions/Subscriptions";
import Analysis from "../Pages/Analysis/Analysis";
import RestaurantRequest from "../Pages/RestaurantRequest/RestaurantRequest";
import UserList from "../Pages/UserList/UserList";
import Earnings from "../Pages/Earnings/Earnings";
import Categories from "../Pages/Categories/Categories";
import Reports from "../Pages/Reports/Reports";
import Settings from "../Pages/Settings/Settings";
import AllMessages from "../Pages/Messages/AllMessages";
import BlockedList from "../Pages/BlockedList/BlockedList";
import ChangePass from "../Pages/AdminProfile/ChangePass";
import AdsSetup from "../Pages/AdsSetup/AdsSetup";
import ActivityEvents from "../Pages/Activity & Events/ActivityEvents";
import VenueListingApproval from "../Pages/Venue & Service/VenueListingApproval";
import VenueApproval from "../Components/VenueandService/VenueDetails";
import Veneudetails from "../Pages/Venue & Service/veneudetails";
export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/forgate-password",
    element: <ForgatePassword />,
  },
  {
    path: "/verify-code",
    element: <VerifyCode />,
  },
  {
    path: "/new-password",
    element: <NewPass />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/user-list", element: <UserList /> },
          { path: "/block-list", element: <BlockedList /> },
          { path: "/earnings", element: <Earnings /> },
          { path: "/restaurant-request", element: <RestaurantRequest /> },
          { path: "/analysis-page", element: <AnalysisPage /> },
          { path: "/analysis/:id", element: <Analysis /> },
          { path: "/subscriptions", element: <Subscriptions /> },
          { path: "/categories", element: <Categories /> },
          { path: "/reports", element: <Reports /> },
          { path: "/ads-setup", element: <AdsSetup /> },
            { path: "/activity&events", element: <ActivityEvents /> },
          { path: "/notifications", element: <Notifications /> },
          { path: "/settings", element: <Settings /> },
          { path: "/settings/about-us", element: <AboutUs /> },
          { path: "/settings/privacy-policy", element: <PrivacyPolicy /> },
          { path: "/settings/terms-condition", element: <TermsCondition /> },
          { path: "/settings/profile", element: <ProfilePage /> },
          { path: "/settings/change-password", element: <ChangePass /> },
          { path: "/messages", element: <AllMessages /> },
          { path: "/venueandservice", element: <VenueListingApproval /> },
          { path: "/venueandservice/venuedetails/:id", element: <Veneudetails/> },
        ],
      },
    ],
  },
]);
