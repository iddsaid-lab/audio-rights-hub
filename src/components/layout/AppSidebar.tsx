import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  Music,
  User,
  FileCheck,
  FileText,
  Settings,
  CreditCard,
  Users,
  Bell,
  Shield,
  DollarSign,
  CheckSquare,
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const isActive = (path: string) => location.pathname.startsWith(path);
  const basePath = user.role === 'artist' ? '/artist' : '/admin';

  const renderArtistMenu = () => (
    <SidebarGroup>
      <SidebarGroupLabel>Artist Portal</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`${basePath}/dashboard`)}>
              <Link to={`${basePath}/dashboard`}>
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`${basePath}/profile`)}>
              <Link to={`${basePath}/profile`}>
                <User size={18} />
                <span>My Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`${basePath}/audios`)}>
              <Link to={`${basePath}/audios`}>
                <Music size={18} />
                <span>My Audios</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`${basePath}/copyrights`)}>
              <Link to={`${basePath}/copyrights`}>
                <FileCheck size={18} />
                <span>Copyrights</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`${basePath}/licenses`)}>
              <Link to={`${basePath}/licenses`}>
                <FileText size={18} />
                <span>Licenses</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(`${basePath}/payments`)}>
              <Link to={`${basePath}/payments`}>
                <CreditCard size={18} />
                <span>Payments</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  // Function to check if user has required role
  const hasRole = (requiredRole: string) => {
    return user.role === requiredRole;
  };

  // Function to check if user has any of the required roles
  const hasAnyRole = (requiredRoles: string[]) => {
    return requiredRoles.includes(user.role);
  };

  const renderAdminMenu = () => (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Administration</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`${basePath}/dashboard`)}>
                <Link to={`${basePath}/dashboard`}>
                  <Home size={18} />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {/* Officers, Managers can view artists */}
            {hasAnyRole(['manager', 'officer']) && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`${basePath}/artists`)}>
                  <Link to={`${basePath}/artists`}>
                    <Users size={18} />
                    <span>Artists</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            
            {/* All admin roles can view audios */}
            {user.role !== 'cashier' && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`${basePath}/audios`)}>
                  <Link to={`${basePath}/audios`}>
                    <Music size={18} />
                    <span>Audios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            
            {/* Only cashiers can access payments */}
            {hasRole('cashier') && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`${basePath}/payments`)}>
                  <Link to={`${basePath}/payments`}>
                    <DollarSign size={18} />
                    <span>Payment Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            
            {/* Only managers can approve copyrights */}
            {hasRole('manager') && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`${basePath}/approvals`)}>
                  <Link to={`${basePath}/approvals`}>
                    <CheckSquare size={18} />
                    <span>Final Approvals</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel>Verification</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Officers and Managers can verify artists */}
            {hasAnyRole(['manager', 'officer']) && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`${basePath}/verifications`)}>
                  <Link to={`${basePath}/verifications`}>
                    <Shield size={18} />
                    <span>Artist Verifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            
            {/* Copyright Requests for all admin roles (including cashier) */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive(`${basePath}/copyright-requests`)}>
                <Link to={`${basePath}/copyright-requests`}>
                  <Bell size={18} />
                  <span>Copyright Requests</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );

  return (
    <>
      <Sidebar>
        <SidebarHeader className="px-3 py-2">
          <div className="flex items-center space-x-2">
            <Music className="h-6 w-6 text-brand-purple" />
            <span className="font-bold text-lg">
              {user.role === 'artist' ? 'Artist Portal' : 'COSOTA Admin'}
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {user.role === 'artist' ? renderArtistMenu() : renderAdminMenu()}
        </SidebarContent>
        <SidebarFooter>
          <div className="px-4 py-2">
            <Link to={`${basePath}/settings`} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="flex items-center h-12 px-4 border-b">
        <SidebarTrigger />
      </div>
    </>
  );
};

export default AppSidebar;
