
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { mockAudios } from '@/data/mockData';
import { Music, Upload, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ArtistAudios = () => {
  const { user } = useAuth();
  
  // Filter audios for the current artist
  const artistAudios = mockAudios.filter(audio => audio.artistId === user?.id);
  
  const pendingAudios = artistAudios.filter(audio => audio.copyrightStatus === 'pending');
  const approvedAudios = artistAudios.filter(audio => audio.copyrightStatus === 'approved');
  const rejectedAudios = artistAudios.filter(audio => audio.copyrightStatus === 'rejected');
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Audios</h1>
          <p className="text-gray-600">Manage your audio recordings</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Audio
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Audios ({artistAudios.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingAudios.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedAudios.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedAudios.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artistAudios.length > 0 ? (
              artistAudios.map(audio => (
                <Card key={audio.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{audio.title}</CardTitle>
                        <CardDescription>
                          Uploaded on {new Date(audio.uploadDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={
                        audio.copyrightStatus === 'approved' 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : audio.copyrightStatus === 'rejected'
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                      }>
                        {audio.copyrightStatus === 'approved' 
                          ? 'Approved' 
                          : audio.copyrightStatus === 'rejected'
                            ? 'Rejected'
                            : 'Pending'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md flex items-center justify-center bg-gray-100 h-40">
                        {audio.coverArt ? (
                          <img src={audio.coverArt} alt={audio.title} className="h-full object-cover" />
                        ) : (
                          <Music className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          Play
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </div>
                      
                      {audio.copyrightStatus === 'pending' && (
                        <Button variant="default" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Register Copyright
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Music className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No audios yet</h3>
                <p className="mt-1 text-gray-500">Upload your first audio to get started</p>
                <Button className="mt-4">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Audio
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingAudios.length > 0 ? (
              pendingAudios.map(audio => (
                <Card key={audio.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{audio.title}</CardTitle>
                        <CardDescription>
                          Uploaded on {new Date(audio.uploadDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md flex items-center justify-center bg-gray-100 h-40">
                        {audio.coverArt ? (
                          <img src={audio.coverArt} alt={audio.title} className="h-full object-cover" />
                        ) : (
                          <Music className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          Play
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </div>
                      
                      <Button variant="default" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Register Copyright
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Music className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No pending audios</h3>
                <p className="mt-1 text-gray-500">All your audios have been processed</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="approved">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedAudios.length > 0 ? (
              approvedAudios.map(audio => (
                <Card key={audio.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{audio.title}</CardTitle>
                        <CardDescription>
                          Uploaded on {new Date(audio.uploadDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Approved
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md flex items-center justify-center bg-gray-100 h-40">
                        {audio.coverArt ? (
                          <img src={audio.coverArt} alt={audio.title} className="h-full object-cover" />
                        ) : (
                          <Music className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          Play
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Music className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No approved audios</h3>
                <p className="mt-1 text-gray-500">None of your audios have been approved yet</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="rejected">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rejectedAudios.length > 0 ? (
              rejectedAudios.map(audio => (
                <Card key={audio.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{audio.title}</CardTitle>
                        <CardDescription>
                          Uploaded on {new Date(audio.uploadDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Rejected
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md flex items-center justify-center bg-gray-100 h-40">
                        {audio.coverArt ? (
                          <img src={audio.coverArt} alt={audio.title} className="h-full object-cover" />
                        ) : (
                          <Music className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          Play
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Rejection Reason
                        </Button>
                      </div>
                      
                      <Button variant="default" className="w-full">
                        Resubmit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Music className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No rejected audios</h3>
                <p className="mt-1 text-gray-500">None of your audios have been rejected</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistAudios;
