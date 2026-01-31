import { useState } from "react";

function Profile({ setActiveTab }) {
  const [userData, setUserData] = useState({
    name: "Md. Mehedi Hasan",
    email: "mdmehedihasan@gmail.com",
    number: "01712345678",
    address: "79/A Joker Vila, Gotham City",
  });
  return (
    <div >
      <p className="mb-5 text-2xl font-bold text-center ">
        Your Profile
      </p>
      <form className="space-y-2 w-auto md:w-[480px]">
        <div>
          <label className="mb-2 text-xl font-bold ">User Name</label>
          <input
            type="text"
            name="fullName"
            value={userData.name}
            className="w-full px-5 py-3 mt-5 rounded-md outline-none placeholder:text-xl"
            placeholder="Enter full name"
            disabled
          />
        </div>
        <div>
          <label className="mb-2 text-xl font-bold ">Email</label>
          <input
            type="email"
            name="contactNo"
            value={userData.email}
            className="w-full px-5 py-3 mt-5 rounded-md outline-none placeholder:text-xl"
            placeholder="Enter Email"
            disabled
          />
        </div>
        <div>
          <label className="mb-2 text-xl font-bold ">
            Contact No
          </label>
          <input
            type="number"
            name="location"
            value={userData.number}
            className="w-full px-5 py-3 mt-5 rounded-md outline-none placeholder:text-xl"
            placeholder="Contact No"
            disabled
          />
        </div>

        <div className="py-3 text-center">
          <button
            onClick={() => setActiveTab("/settings/editProfile")}
            className="bg-[#71abe0] text-white font-semibold w-full py-2 rounded-lg"
          >
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}
export default Profile;
