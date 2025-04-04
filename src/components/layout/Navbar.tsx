
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { MusicIcon, User as UserIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-brand-purple hover:opacity-80 transition-opacity">
          <MusicIcon className="h-6 w-6" />
          <span className="text-xl font-bold">AudioRightsHub</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-brand-purple transition-colors">
            Home
          </Link>
          <Link to="/browse" className="text-gray-700 hover:text-brand-purple transition-colors">
            Browse Audio
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-brand-purple transition-colors">
            About COSOTA
          </Link>
          <Link to="/help" className="text-gray-700 hover:text-brand-purple transition-colors">
            Help
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to={user.role === 'artist' ? "/artist/dashboard" : "/admin/dashboard"} 
                className="flex items-center space-x-2 text-gray-700 hover:text-brand-purple"
              >
                <span className="hidden sm:inline">{user.fullName}</span>
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} className="h-8 w-8 rounded-full" />
                ) : (
                  <UserIcon className="h-5 w-5" />
                )}
              </Link>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="default">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
