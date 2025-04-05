
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { MusicIcon, User as UserIcon, Bell, Menu, X } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-1 rounded-full focus:ring-2 focus:ring-brand-purple">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="px-4 py-3 font-medium border-b">
                    Notifications
                  </div>
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div className="flex flex-col">
                      <div className="font-medium">New copyright request</div>
                      <div className="text-sm text-gray-500">Your song "Summer Vibes" has been submitted for copyright review</div>
                      <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div className="flex flex-col">
                      <div className="font-medium">Payment received</div>
                      <div className="text-sm text-gray-500">Your royalty payment of $45.80 has been processed</div>
                      <div className="text-xs text-gray-400 mt-1">2 days ago</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-brand-purple">
                    <span className="hidden sm:inline">{user.fullName}</span>
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.fullName} className="h-8 w-8 rounded-full" />
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={user.role === 'artist' ? "/artist/dashboard" : "/admin/dashboard"}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={user.role === 'artist' ? "/artist/profile" : "/admin/settings"}>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="default">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="py-4 border-b">
                  <Link to="/" className="flex items-center space-x-2 text-brand-purple" onClick={() => setIsMobileMenuOpen(false)}>
                    <MusicIcon className="h-6 w-6" />
                    <span className="text-xl font-bold">AudioRightsHub</span>
                  </Link>
                </div>
                
                <div className="flex-1 py-8">
                  <nav className="flex flex-col space-y-6">
                    <Link to="/" className="text-gray-700 hover:text-brand-purple transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      Home
                    </Link>
                    <Link to="/browse" className="text-gray-700 hover:text-brand-purple transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      Browse Audio
                    </Link>
                    <Link to="/about" className="text-gray-700 hover:text-brand-purple transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      About COSOTA
                    </Link>
                    <Link to="/help" className="text-gray-700 hover:text-brand-purple transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      Help
                    </Link>
                    
                    {user && (
                      <>
                        <Link to={user.role === 'artist' ? "/artist/dashboard" : "/admin/dashboard"} className="text-gray-700 hover:text-brand-purple transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                          Dashboard
                        </Link>
                        <Link to={user.role === 'artist' ? "/artist/profile" : "/admin/settings"} className="text-gray-700 hover:text-brand-purple transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                          Profile
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
                
                <div className="py-4 border-t">
                  {user ? (
                    <Button variant="default" className="w-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="default" className="w-full">Register</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
