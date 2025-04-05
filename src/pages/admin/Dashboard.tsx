
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Music, FileCheck, Shield, User, UserCheck, AlertCircle, DollarSign, CheckSquare, CreditCard } from 'lucide-react';
import { mockAudios, mockArtistProfiles, mockVerificationRequests, mockCopyrightRequests } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Calculate stats
  const pendingVerifications = mockVerificationRequests.filter(req => req.status === 'pending').length;
  const pendingCopyrightRequests = mockCopyrightRequests.filter(req => req.status === 'pending').length;
  const totalArtists = mockArtistProfiles.length;
  const totalAudios = mockAudios.length;
  
  // Role-specific content
  const renderManagerDashboard = () => (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Artists</p>
                <h3 className="text-3xl font-bold mt-2">{totalArtists}</h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Audios</p>
                <h3 className="text-3xl font-bold mt-2">{totalAudios}</h3>
              </div>
              <div className="h-10 w-10 bg-brand-light-purple rounded-md flex items-center justify-center">
                <Music className="h-5 w-5 text-brand-purple" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <h3 className="text-3xl font-bold mt-2">{pendingCopyrightRequests}</h3>
              </div>
              <div className="h-10 w-10 bg-amber-100 rounded-md flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                <h3 className="text-3xl font-bold mt-2">{pendingVerifications}</h3>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pending Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Final approvals requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {mockCopyrightRequests.filter(req => req.status === 'pending').map((req) => {
              const audio = mockAudios.find(a => a.id === req.audioId);
              
              return (
                <div key={req.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-brand-light-purple rounded-full flex items-center justify-center mr-3">
                      <FileCheck className="h-5 w-5 text-brand-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium">Copyright Approval: {audio?.title}</h4>
                      <p className="text-sm text-gray-500">From {audio?.artistName} on {new Date(req.submissionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <Link to={`/admin/approvals/${req.id}`}>
                      <Button variant="outline" size="sm">Approve</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
            
            {pendingCopyrightRequests === 0 && (
              <div className="py-8 text-center">
                <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending approvals at the moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
  
  const renderOfficerDashboard = () => (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Artist Verifications</p>
                <h3 className="text-3xl font-bold mt-2">{pendingVerifications}</h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Copyright Requests</p>
                <h3 className="text-3xl font-bold mt-2">{pendingCopyrightRequests}</h3>
              </div>
              <div className="h-10 w-10 bg-brand-light-purple rounded-md flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-brand-purple" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Artists</p>
                <h3 className="text-3xl font-bold mt-2">{totalArtists}</h3>
              </div>
              <div className="h-10 w-10 bg-amber-100 rounded-md flex items-center justify-center">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Audios</p>
                <h3 className="text-3xl font-bold mt-2">{totalAudios}</h3>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                <Music className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pending Verifications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pending Artist Verifications</CardTitle>
          <CardDescription>Artist verification requests requiring review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {mockVerificationRequests.filter(req => req.status === 'pending').map((req) => (
              <div key={req.artistId} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Artist Verification: {req.artistName}</h4>
                    <p className="text-sm text-gray-500">Submitted on {new Date(req.submissionDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <Link to={`/admin/verifications/${req.artistId}`}>
                    <Button variant="outline" size="sm">Review</Button>
                  </Link>
                </div>
              </div>
            ))}
            
            {pendingVerifications === 0 && (
              <div className="py-8 text-center">
                <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending verifications at the moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Copyright Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Copyright Requests</CardTitle>
          <CardDescription>Copyright registration requests requiring processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {mockCopyrightRequests.filter(req => req.status === 'pending').map((req) => {
              const audio = mockAudios.find(a => a.id === req.audioId);
              
              return (
                <div key={req.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-brand-light-purple rounded-full flex items-center justify-center mr-3">
                      <FileCheck className="h-5 w-5 text-brand-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium">Copyright Request: {audio?.title}</h4>
                      <p className="text-sm text-gray-500">From {audio?.artistName} on {new Date(req.submissionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <Link to={`/admin/copyright-requests/${req.id}`}>
                      <Button variant="outline" size="sm">Process</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
            
            {pendingCopyrightRequests === 0 && (
              <div className="py-8 text-center">
                <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending copyright requests at the moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
  
  const renderCashierDashboard = () => (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                <h3 className="text-3xl font-bold mt-2">
                  {mockCopyrightRequests.filter(req => req.paymentStatus === 'pending').length}
                </h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Payments Collected Today</p>
                <h3 className="text-3xl font-bold mt-2">$580</h3>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Copyright Fees</p>
                <h3 className="text-3xl font-bold mt-2">$12,450</h3>
              </div>
              <div className="h-10 w-10 bg-brand-light-purple rounded-md flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-brand-purple" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment Processing */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pending Payment Processing</CardTitle>
          <CardDescription>Copyright fee payments requiring processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {mockCopyrightRequests.filter(req => req.paymentStatus === 'pending').map((req) => {
              const audio = mockAudios.find(a => a.id === req.audioId);
              const artist = mockArtistProfiles.find(a => a.userId === req.artistId);
              
              return (
                <div key={req.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Copyright Fee: {audio?.title}</h4>
                      <p className="text-sm text-gray-500">
                        From {artist?.fullName} • Amount: ${req.paymentAmount || 50}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Link to={`/admin/payments/${req.id}`}>
                      <Button variant="outline" size="sm">Process Payment</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
            
            {mockCopyrightRequests.filter(req => req.paymentStatus === 'pending').length === 0 && (
              <div className="py-8 text-center">
                <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending payments at the moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Recently processed payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {mockCopyrightRequests.filter(req => req.paymentStatus === 'paid').slice(0, 5).map((req) => {
              const audio = mockAudios.find(a => a.id === req.audioId);
              
              return (
                <div key={req.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Payment Received: {audio?.title}</h4>
                      <p className="text-sm text-gray-500">
                        Amount: ${req.paymentAmount} • Date: {req.paymentDate ? new Date(req.paymentDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Paid</Badge>
                  </div>
                </div>
              );
            })}
            
            {mockCopyrightRequests.filter(req => req.paymentStatus === 'paid').length === 0 && (
              <div className="py-8 text-center">
                <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No recent payments</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
  
  const renderDashboardByRole = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'manager':
        return renderManagerDashboard();
      case 'officer':
        return renderOfficerDashboard();
      case 'cashier':
        return renderCashierDashboard();
      default:
        return (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Restricted Access</h2>
            <p className="text-gray-600 mb-6">You don't have permission to access this dashboard.</p>
          </div>
        );
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">COSOTA Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.fullName} | Role: {user?.role}</p>
        </div>
      </div>
      
      {renderDashboardByRole()}
    </div>
  );
};

export default AdminDashboard;
