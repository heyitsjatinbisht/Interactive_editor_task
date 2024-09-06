import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline">
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/editor" className="hover:underline">
                Editor
              </Link>
            </li>
            <li>
              <Link to="/notes" className="hover:underline">
                Notes
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
