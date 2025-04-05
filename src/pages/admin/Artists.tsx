
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockArtistProfiles } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Search, User, Music, Shield, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminArtists = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<typeof mockArtistProfiles[0] | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  // Filter artists based on search query
  const filteredArtists = mockArtistProfiles.filter(artist => 
    artist.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.phoneNumber.includes(searchQuery)
  );
  
  const verifiedArtists = filteredArtists.filter(artist => artist.verificationStatus === 'verified');
  const pendingArtists = filteredArtists.filter(artist => artist.verificationStatus === 'pending');
  const rejectedArtists = filteredArtists.filter(artist => artist.verificationStatus === 'rejected');

  const displayArtists = activeTab === 'all' 
    ? filteredArtists 
    : activeTab === 'verified' 
      ? verifiedArtists 
      : activeTab === 'pending' 
        ? pendingArtists 
        : rejectedArtists;

  const openVerifyDialog = (artist: typeof mockArtistProfiles[0]) => {
    setSelectedArtist(artist);
    setIsVerifyDialogOpen(true);
  };

  const handleVerify = (approved: boolean) => {
    if (!selectedArtist) return;

    const status = approved ? 'verified' : 'rejected';
    toast({
      title: approved ? "Artist Verified" : "Artist Rejected",
      description: `${selectedArtist.fullName} has been ${status}.`,
      variant: approved ? "default" : "destructive",
    });

    setIsVerifyDialogOpen(false);
  };

  const handleViewProfile = (artistId: string) => {
    toast({
      title: "Profile View",
      description: `Viewing details for artist ID: ${artistId.substring(0, 8)}`,
    });
  };

  const handleViewAudios = (artistId: string) => {
    toast({
      title: "Audios View",
      description: `Viewing audio recordings for artist ID: ${artistId.substring(0, 8)}`,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Registered Artists</h1>
          <p className="text-gray-600">View and manage registered artists</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search artists by name or phone number"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Artists ({filteredArtists.length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({verifiedArtists.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingArtists.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedArtists.length})</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayArtists.map((artist) => (
          <Card key={artist.userId}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{artist.fullName}</CardTitle>
                  <CardDescription>ID: {artist.userId.substring(0, 8)}</CardDescription>
                </div>
                <Badge className={
                  artist.verificationStatus === 'verified' 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : artist.verificationStatus === 'rejected'
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-amber-100 text-amber-800 border-amber-200"
                }>
                  {artist.verificationStatus === 'verified' 
                    ? 'Verified' 
                    : artist.verificationStatus === 'rejected'
                      ? 'Rejected'
                      : 'Pending'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center h-32 w-32 bg-gray-100 rounded-full mx-auto">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-medium text-gray-500">Phone Number</h3>
                    <p>{artist.phoneNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">National ID</h3>
                    <p>{artist.nationalIdNumber}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={() => handleViewProfile(artist.userId)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => handleViewAudios(artist.userId)}>
                    <Music className="mr-2 h-4 w-4" />
                    Audios
                  </Button>
                  {artist.verificationStatus === 'pending' && (
                    <Button variant="outline" className="flex-1" onClick={() => openVerifyDialog(artist)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {displayArtists.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No artists found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search query</p>
          </div>
        )}
      </div>

      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Artist</DialogTitle>
            <DialogDescription>
              {selectedArtist && (
                <>Verify identity of {selectedArtist.fullName} with ID: {selectedArtist.nationalIdNumber}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="font-medium">National ID:</div>
              <div>{selectedArtist?.nationalIdNumber}</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="font-medium">Phone Number:</div>
              <div>{selectedArtist?.phoneNumber}</div>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => handleVerify(false)}>
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={() => handleVerify(true)}>
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArtists;
