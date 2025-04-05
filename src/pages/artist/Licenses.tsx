
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { mockLicenses } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Clock } from 'lucide-react';

const ArtistLicenses = () => {
  const { user } = useAuth();
  
  // Get licenses for this artist (both as licensor and licensee)
  const artistLicenses = mockLicenses.filter(license => license.licenseeId === user?.id);
  
  const activeLicenses = artistLicenses.filter(license => license.status === 'active');
  const expiredLicenses = artistLicenses.filter(license => license.status === 'expired');
  const revokedLicenses = artistLicenses.filter(license => license.status === 'revoked');
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Licenses</h1>
          <p className="text-gray-600">Manage your music licenses</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Request New License
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Licenses ({artistLicenses.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeLicenses.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredLicenses.length})</TabsTrigger>
          <TabsTrigger value="revoked">Revoked ({revokedLicenses.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artistLicenses.length > 0 ? (
              artistLicenses.map(license => (
                <Card key={license.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>License #{license.id.substring(0, 8)}</CardTitle>
                        <CardDescription>
                          Issued on {new Date(license.issueDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={
                        license.status === 'active' 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : license.status === 'expired'
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-red-100 text-red-800 border-red-200"
                      }>
                        {license.status === 'active' 
                          ? 'Active' 
                          : license.status === 'expired'
                            ? 'Expired'
                            : 'Revoked'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">License Type</h3>
                          <p className="mt-1 capitalize">{license.licenseType}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
                          <p className="mt-1">{license.audioId}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Expiration Date</h3>
                          <p className="mt-1">{new Date(license.expirationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Fee</h3>
                          <p className="mt-1">${license.fee}</p>
                        </div>
                      </div>
                      
                      {license.restrictions && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Restrictions</h3>
                          <p className="mt-1 text-sm">{license.restrictions}</p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <FileText className="mr-2 h-4 w-4" />
                          View License
                        </Button>
                        {license.status === 'active' && (
                          <Button variant="outline" className="flex-1">
                            <Calendar className="mr-2 h-4 w-4" />
                            Renew
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No licenses yet</h3>
                <p className="mt-1 text-gray-500">Request a license to use other artists' work</p>
                <Button className="mt-4">
                  <FileText className="mr-2 h-4 w-4" />
                  Request License
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeLicenses.length > 0 ? (
              activeLicenses.map(license => (
                <Card key={license.id}>
                  {/* Same card content as in the all tab, but only for active licenses */}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>License #{license.id.substring(0, 8)}</CardTitle>
                        <CardDescription>
                          Issued on {new Date(license.issueDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">License Type</h3>
                          <p className="mt-1 capitalize">{license.licenseType}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
                          <p className="mt-1">{license.audioId}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Expiration Date</h3>
                          <p className="mt-1">{new Date(license.expirationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Fee</h3>
                          <p className="mt-1">${license.fee}</p>
                        </div>
                      </div>
                      
                      {license.restrictions && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Restrictions</h3>
                          <p className="mt-1 text-sm">{license.restrictions}</p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <FileText className="mr-2 h-4 w-4" />
                          View License
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
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No active licenses</h3>
                <p className="mt-1 text-gray-500">You don't have any active licenses</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="expired">
          {/* Similar structure for expired licenses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expiredLicenses.length > 0 ? (
              expiredLicenses.map(license => (
                <Card key={license.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>License #{license.id.substring(0, 8)}</CardTitle>
                        <CardDescription>
                          Expired on {new Date(license.expirationDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Expired
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">License Type</h3>
                          <p className="mt-1 capitalize">{license.licenseType}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
                          <p className="mt-1">{license.audioId}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                        <h3 className="font-medium text-amber-800">License Expired</h3>
                        <p className="mt-1 text-amber-700">This license has expired. You may no longer use this audio.</p>
                      </div>
                      
                      <Button variant="default" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Renew License
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No expired licenses</h3>
                <p className="mt-1 text-gray-500">You don't have any expired licenses</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="revoked">
          {/* Similar structure for revoked licenses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {revokedLicenses.length > 0 ? (
              revokedLicenses.map(license => (
                <Card key={license.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>License #{license.id.substring(0, 8)}</CardTitle>
                        <CardDescription>
                          Revoked on {new Date(license.expirationDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Revoked
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">License Type</h3>
                          <p className="mt-1 capitalize">{license.licenseType}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
                          <p className="mt-1">{license.audioId}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                        <h3 className="font-medium text-red-800">License Revoked</h3>
                        <p className="mt-1 text-red-700">This license has been revoked by the copyright holder. You may no longer use this audio.</p>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No revoked licenses</h3>
                <p className="mt-1 text-gray-500">You don't have any revoked licenses</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistLicenses;
