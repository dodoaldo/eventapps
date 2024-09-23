import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Event App</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-400">Home</Link>
          </li>
          <li>
            <Link to="/events" className="text-white hover:text-gray-400">Events</Link>
          </li>
          {isLoggedIn && user.role === 'organizer' && (
            <li>
              <Link to="/create-event" className="text-white hover:text-gray-400">Create Event</Link>
            </li>
          )}
          {isLoggedIn ? (
            <>
              <li>
                <button onClick={logout} className="text-white hover:text-gray-400">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-white hover:text-gray-400">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-white hover:text-gray-400">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
