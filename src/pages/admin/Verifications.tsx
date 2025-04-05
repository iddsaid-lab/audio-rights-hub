
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { mockArtistProfiles, mockVerificationRequests } from '@/data/mockData';
import { User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const AdminVerifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  
  const canApprove = user?.role === 'manager' || user?.role === 'officer';
  
  const pendingVerifications = mockVerificationRequests.filter(req => req.status === 'pending');
  const completedVerifications = mockVerificationRequests.filter(req => req.status !== 'pending');
  
  const handleApprove = (artistId: string) => {
    if (!canApprove) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to approve verifications.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Artist Verified",
      description: "The artist has been successfully verified.",
    });
  };
  
  const openRejectDialog = (artistId: string) => {
    setSelectedArtistId(artistId);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };
  
  const handleReject = () => {
    if (!canApprove || !selectedArtistId) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to reject verifications.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Verification Rejected",
      description: "The artist verification has been rejected with feedback.",
    });
    
    setIsRejectDialogOpen(false);
  };
  
  const getArtistProfile = (artistId: string) => {
    return mockArtistProfiles.find(profile => profile.userId === artistId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Artist Verifications</h1>
          <p className="text-gray-600">Manage artist verification requests</p>
        </div>
        <div>
          {!canApprove && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              View Only Mode - {user?.role}
            </Badge>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending ({pendingVerifications.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedVerifications.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingVerifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No pending verification requests at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingVerifications.map((req) => {
                const artistProfile = getArtistProfile(req.artistId);
                
                return (
                  <Card key={req.artistId}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{req.artistName}</CardTitle>
                          <CardDescription>
                            Submitted: {new Date(req.submissionDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-amber-600" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">ID Number</h3>
                            <p className="mt-1">{artistProfile?.nationalIdNumber || 'Not provided'}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                            <p className="mt-1">{artistProfile?.phoneNumber || 'Not provided'}</p>
                          </div>
                          <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">Address</h3>
                            <p className="mt-1">{artistProfile?.address || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Documents</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href="#view-id" onClick={(e) => e.preventDefault()}>View ID</a>
                            </Button>
                            {req.documents.passport && (
                              <Button variant="outline" size="sm" asChild>
                                <a href="#view-passport" onClick={(e) => e.preventDefault()}>View Passport</a>
                              </Button>
                            )}
                            {req.documents.previousWork && (
                              <Button variant="outline" size="sm" asChild>
                                <a href="#view-work" onClick={(e) => e.preventDefault()}>Previous Work</a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => openRejectDialog(req.artistId)}
                        disabled={!canApprove}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button 
                        onClick={() => handleApprove(req.artistId)}
                        disabled={!canApprove}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedVerifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No completed verifications yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedVerifications.map((req) => {
                const artistProfile = getArtistProfile(req.artistId);
                const isApproved = req.status === 'approved';
                
                return (
                  <Card key={req.artistId}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{req.artistName}</CardTitle>
                          <CardDescription>
                            Reviewed: {req.reviewDate ? new Date(req.reviewDate).toLocaleDateString() : 'N/A'}
                          </CardDescription>
                        </div>
                        <Badge className={isApproved 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-red-100 text-red-800 border-red-200"
                        }>
                          {isApproved ? 'Approved' : 'Rejected'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">ID Number</h3>
                            <p className="mt-1">{artistProfile?.nationalIdNumber || 'Not provided'}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                            <p className="mt-1">{artistProfile?.phoneNumber || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        {req.reviewNotes && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Review Notes</h3>
                            <p className="mt-1 text-sm">{req.reviewNotes}</p>
                          </div>
                        )}
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Reviewer</h3>
                          <p className="mt-1">{req.reviewerId || 'System'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Artist Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this verification. This feedback will be shared with the artist.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea 
            placeholder="Enter reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVerifications;
