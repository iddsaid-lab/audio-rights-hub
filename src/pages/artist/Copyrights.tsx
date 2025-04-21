import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { mockCopyrights } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileCheck, FilePlus, Calendar, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ArtistCopyrights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filter copyrights for the current artist
  const artistCopyrights = mockCopyrights.filter(copyright => copyright.ownerId === user?.id);
  
  const activeCopyrights = artistCopyrights.filter(copyright => copyright.status === 'active');
  const pendingCopyrights = artistCopyrights.filter(copyright => copyright.status === 'pending');
  const expiredCopyrights = artistCopyrights.filter(copyright => copyright.status === 'expired');
  
  const handleRegisterNewCopyright = () => {
    navigate('/artist/upload-audio');
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Copyrights</h1>
          <p className="text-gray-600">Manage your registered copyrights</p>
        </div>
        <Button onClick={handleRegisterNewCopyright}>
          <FilePlus className="mr-2 h-4 w-4" />
          Register New Copyright
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({artistCopyrights.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeCopyrights.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCopyrights.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredCopyrights.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artistCopyrights.length > 0 ? (
              artistCopyrights.map(copyright => (
                <Card key={copyright.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>CR-{copyright.registrationNumber}</CardTitle>
                        <CardDescription>
                          Registered on {new Date(copyright.registrationDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={
                        copyright.status === 'active' 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : copyright.status === 'expired'
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                      }>
                        {copyright.status === 'active' 
                          ? 'Active' 
                          : copyright.status === 'expired'
                            ? 'Expired'
                            : 'Pending'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
                        <p className="mt-1">{copyright.audioId}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                          <p className="mt-1">{new Date(copyright.registrationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Expiration Date</h3>
                          <p className="mt-1">{new Date(copyright.expirationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                          <p className="mt-1 capitalize">{copyright.paymentStatus}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                          <p className="mt-1">{copyright.ownerName}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <FileCheck className="mr-2 h-4 w-4" />
                          View Certificate
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Calendar className="mr-2 h-4 w-4" />
                          Renew
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No copyrights yet</h3>
                <p className="mt-1 text-gray-500">Register your first copyright to protect your work</p>
                <Button className="mt-4" onClick={handleRegisterNewCopyright}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Register Copyright
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCopyrights.length > 0 ? (
              activeCopyrights.map(copyright => (
                <Card key={copyright.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>CR-{copyright.registrationNumber}</CardTitle>
                        <CardDescription>
                          Registered on {new Date(copyright.registrationDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
                        <p className="mt-1">{copyright.audioId}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                          <p className="mt-1">{new Date(copyright.registrationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Expiration Date</h3>
                          <p className="mt-1">{new Date(copyright.expirationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                          <p className="mt-1 capitalize">{copyright.paymentStatus}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                          <p className="mt-1">{copyright.ownerName}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <FileCheck className="mr-2 h-4 w-4" />
                          View Certificate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No active copyrights</h3>
                <p className="mt-1 text-gray-500">You don't have any active copyrights at the moment</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingCopyrights.length > 0 ? (
              pendingCopyrights.map(copyright => (
                <Card key={copyright.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>CR-{copyright.registrationNumber}</CardTitle>
                        <CardDescription>
                          Submitted on {new Date(copyright.registrationDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
                        <p className="mt-1">{copyright.audioId}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Submission Date</h3>
                          <p className="mt-1">{new Date(copyright.registrationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                          <p className="mt-1 capitalize">{copyright.paymentStatus}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                        <h3 className="font-medium text-amber-800">Status: In Review</h3>
                        <p className="mt-1 text-amber-700">Your copyright registration is being processed by COSOTA officials.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No pending copyrights</h3>
                <p className="mt-1 text-gray-500">You don't have any pending copyright applications</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="expired">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expiredCopyrights.length > 0 ? (
              expiredCopyrights.map(copyright => (
                <Card key={copyright.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>CR-{copyright.registrationNumber}</CardTitle>
                        <CardDescription>
                          Expired on {new Date(copyright.expirationDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Expired
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
                        <p className="mt-1">{copyright.audioId}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                          <p className="mt-1">{new Date(copyright.registrationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Expiration Date</h3>
                          <p className="mt-1">{new Date(copyright.expirationDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <Button variant="default" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Renew Copyright
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No expired copyrights</h3>
                <p className="mt-1 text-gray-500">You don't have any expired copyrights</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistCopyrights;
