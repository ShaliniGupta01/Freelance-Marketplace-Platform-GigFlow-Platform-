import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

// Utility to get initials from name
const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  const initials = words.map((w) => w[0].toUpperCase()).join("");
  return initials.slice(0, 2);
};

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout()); // client-side logout
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">GigFlow</h1>

        <div className="flex items-center space-x-6 text-gray-700 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-indigo-600 font-bold" : "hover:text-indigo-600"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? "text-indigo-600 font-bold" : "hover:text-indigo-600"
            }
          >
            Create Gig
          </NavLink>

          <NavLink
            to="/hiring"
            className={({ isActive }) =>
              isActive ? "text-indigo-600 font-bold" : "hover:text-indigo-600"
            }
          >
            Hiring
          </NavLink>

          {!user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-indigo-600 font-bold" : "hover:text-indigo-600"
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "text-indigo-600 font-bold" : "hover:text-indigo-600"
                }
              >
                Register
              </NavLink>
            </>
          ) : (
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => setOpen(!open)}
                />
              ) : (
                <div
                  onClick={() => setOpen(!open)}
                  className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer font-semibold"
                >
                  {getInitials(user.name)}
                </div>
              )}

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg p-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <hr className="my-2" />
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
