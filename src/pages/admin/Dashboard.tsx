
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Music, FileCheck, Shield, User, UserCheck, AlertCircle } from 'lucide-react';
import { mockAudios, mockArtistProfiles, mockVerificationRequests, mockCopyrightRequests } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Calculate stats
  const pendingVerifications = mockVerificationRequests.filter(req => req.status === 'pending').length;
  const pendingCopyrightRequests = mockCopyrightRequests.filter(req => req.status === 'pending').length;
  const totalArtists = mockArtistProfiles.length;
  const totalAudios = mockAudios.length;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">COSOTA Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.fullName} | Role: {user?.role}</p>
        </div>
      </div>
      
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
                <p className="text-sm font-medium text-gray-500">Pending Verifications</p>
                <h3 className="text-3xl font-bold mt-2">{pendingVerifications}</h3>
              </div>
              <div className="h-10 w-10 bg-amber-100 rounded-md flex items-center justify-center">
                <Shield className="h-5 w-5 text-amber-600" />
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
              <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pending Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pending Actions</CardTitle>
          <CardDescription>Items requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {/* Artist Verifications */}
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
            
            {/* Copyright Requests */}
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
            
            {pendingVerifications === 0 && pendingCopyrightRequests === 0 && (
              <div className="py-8 text-center">
                <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending actions at the moment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Artist Verified: John Makonde</h4>
                  <p className="text-sm text-gray-500">Verified by Emmanuel Mabondo on {new Date('2023-01-15').toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>
              </div>
            </div>
            
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-brand-light-purple rounded-full flex items-center justify-center mr-3">
                  <FileCheck className="h-5 w-5 text-brand-purple" />
                </div>
                <div>
                  <h4 className="font-medium">Copyright Registered: African Sunset</h4>
                  <p className="text-sm text-gray-500">Issued to John Makonde on {new Date('2023-02-20').toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Badge variant="outline" className="bg-brand-light-purple text-brand-purple border-brand-purple/20">Registered</Badge>
              </div>
            </div>
            
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-brand-light-purple rounded-full flex items-center justify-center mr-3">
                  <FileCheck className="h-5 w-5 text-brand-purple" />
                </div>
                <div>
                  <h4 className="font-medium">Copyright Registered: Dar City Lights</h4>
                  <p className="text-sm text-gray-500">Issued to John Makonde on {new Date('2023-04-25').toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Badge variant="outline" className="bg-brand-light-purple text-brand-purple border-brand-purple/20">Registered</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
