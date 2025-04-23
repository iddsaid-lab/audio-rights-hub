import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ApiService from '../../services/ApiService';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileCheck, FilePlus, Calendar, Clock, Download, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const ArtistCopyrights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch copyrights for the current artist from backend
  const [artistCopyrights, setArtistCopyrights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    ApiService.getMyCopyrights()
      .then((data) => {
        setArtistCopyrights(data);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const activeCopyrights = artistCopyrights.filter(copyright => copyright.status === 'active');
  const pendingCopyrights = artistCopyrights.filter(copyright => copyright.status === 'pending');
  const expiredCopyrights = artistCopyrights.filter(copyright => copyright.status === 'expired');
  
  const handleRegisterNewCopyright = () => {
    navigate('/artist/upload-audio');
  };
  
  const handleDownloadCertificate = (registrationNumber: string) => {
    console.log('Downloading certificate:', registrationNumber);
    toast({
      title: "Certificate Download Started",
      description: `Downloading certificate ${registrationNumber}`,
    });
  };

  const handleRenewalRequest = (copyrightId: string) => {
    console.log('Processing renewal for:', copyrightId);
    toast({
      title: "Renewal Request Submitted",
      description: "Your copyright renewal request has been submitted for processing.",
    });
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                              <Eye className="mr-2 h-4 w-4" />
                              View Certificate
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Copyright Certificate</DialogTitle>
                              <DialogDescription>
                                Registration #{copyright.registrationNumber}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="p-6 border rounded-lg">
                              <div className="space-y-4">
                                <div className="text-center mb-6">
                                  <h2 className="text-2xl font-bold">Copyright Certificate</h2>
                                  <p className="text-gray-600">Registration #{copyright.registrationNumber}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
                                    <p className="mt-1">{copyright.audioId}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                                    <p className="mt-1">{copyright.ownerName}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                                    <p className="mt-1">{new Date(copyright.registrationDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Expiration Date</h3>
                                    <p className="mt-1">{new Date(copyright.expirationDate).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                  <Button 
                                    variant="outline"
                                    onClick={() => handleDownloadCertificate(copyright.registrationNumber)}
                                  >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Certificate
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                              <Calendar className="mr-2 h-4 w-4" />
                              Renew
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Renew Copyright</DialogTitle>
                              <DialogDescription>
                                Extend the protection of your copyright for another term.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Current Expiration</h3>
                                  <p className="mt-1">{new Date(copyright.expirationDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">New Expiration</h3>
                                  <p className="mt-1">{new Date(new Date(copyright.expirationDate).setFullYear(new Date(copyright.expirationDate).getFullYear() + 1)).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                                <p className="text-sm text-amber-800">
                                  Renewing your copyright will extend its protection for another year. A processing fee may apply.
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" className="w-full" onClick={() => handleRenewalRequest(copyright.id)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Submit Renewal Request
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
