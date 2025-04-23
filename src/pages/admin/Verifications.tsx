import React, { useState } from 'react';import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ApiService from '../../services/ApiService';
import { useEffect } from 'react';
import { User, CheckCircle, XCircle, Clock, FileText, Eye, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const AdminVerifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isViewDocumentDialogOpen, setIsViewDocumentDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{title: string, type: string}>({title: '', type: ''});
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [walletGenerating, setWalletGenerating] = useState(false);
  const [generatedWallet, setGeneratedWallet] = useState<string | null>(null);
  
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
    
    // First, open wallet generation dialog
    setSelectedArtistId(artistId);
    setIsWalletDialogOpen(true);
  };

  const generateWallet = async () => {
    setWalletGenerating(true);
    
    try {
      // Simulate blockchain wallet generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock wallet address
      const randomWallet = '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setGeneratedWallet(randomWallet);
      setWalletGenerating(false);
    } catch (error) {
      toast({
        title: "Wallet Generation Failed",
        description: "There was an error generating the blockchain wallet. Please try again.",
        variant: "destructive"
      });
      setWalletGenerating(false);
    }
  };

  const confirmApprovalWithWallet = () => {
    if (!generatedWallet || !selectedArtistId) return;
    
    toast({
      title: "Artist Verified",
      description: "The artist has been successfully verified and assigned a blockchain wallet address.",
    });
    
    setIsWalletDialogOpen(false);
    setGeneratedWallet(null);
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

  const viewDocument = (documentType: string, artistName: string) => {
    setSelectedDocument({
      title: `${artistName}'s ${documentType}`,
      type: documentType
    });
    setIsViewDocumentDialogOpen(true);
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
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => viewDocument('National ID', req.artistName)}
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View ID
                            </Button>
                            {req.documents.passport && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => viewDocument('Passport', req.artistName)}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                View Passport
                              </Button>
                            )}
                            {req.documents.previousWork && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => viewDocument('Previous Work', req.artistName)}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                Previous Work
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
                        
                        {isApproved && (
                          <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                            <h3 className="text-sm font-medium text-green-800 flex items-center">
                              <Wallet className="h-4 w-4 mr-2" />
                              Blockchain Wallet
                            </h3>
                            <p className="mt-1 text-sm text-green-700 font-mono break-all">
                              {artistProfile?.walletAddress || '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'}
                            </p>
                          </div>
                        )}
                        
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
      
      {/* Reject Dialog */}
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

      {/* Document Viewer Dialog */}
      <Dialog open={isViewDocumentDialogOpen} onOpenChange={setIsViewDocumentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedDocument.title}</DialogTitle>
            <DialogDescription>
              Viewing submitted verification document
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center bg-gray-100 p-4 rounded-md min-h-[200px]">
            {selectedDocument.type === 'National ID' && (
              <div className="flex flex-col items-center">
                <FileText className="h-16 w-16 text-gray-400 mb-2" />
                <p className="text-gray-500">National ID Document Preview</p>
                <p className="text-xs text-gray-400 mt-2">(Sample document for demonstration)</p>
              </div>
            )}
            {selectedDocument.type === 'Passport' && (
              <div className="flex flex-col items-center">
                <FileText className="h-16 w-16 text-gray-400 mb-2" />
                <p className="text-gray-500">Passport Document Preview</p>
                <p className="text-xs text-gray-400 mt-2">(Sample document for demonstration)</p>
              </div>
            )}
            {selectedDocument.type === 'Previous Work' && (
              <div className="flex flex-col items-center">
                <FileText className="h-16 w-16 text-gray-400 mb-2" />
                <p className="text-gray-500">Previous Work Document Preview</p>
                <p className="text-xs text-gray-400 mt-2">(Sample document for demonstration)</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewDocumentDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blockchain Wallet Generation Dialog */}
      <Dialog open={isWalletDialogOpen} onOpenChange={(open) => {
        setIsWalletDialogOpen(open);
        if (!open) {
          setGeneratedWallet(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Blockchain Wallet</DialogTitle>
            <DialogDescription>
              Generate a blockchain wallet address for this artist. This will be used to track all of their work and copyright registrations.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!generatedWallet ? (
              <div className="flex flex-col items-center justify-center p-6">
                <Wallet className="h-16 w-16 text-brand-purple mb-4" />
                <p className="text-center text-gray-600 mb-4">
                  A unique blockchain wallet will be generated for this artist. This wallet address will be used to track all of their work and copyright registrations.
                </p>
                <Button 
                  onClick={generateWallet} 
                  disabled={walletGenerating}
                  className="w-full"
                >
                  {walletGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      Generating Wallet...
                    </>
                  ) : (
                    'Generate Wallet'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                  <h3 className="font-medium text-green-800 mb-2">Wallet Generated Successfully</h3>
                  <p className="text-sm text-green-700 font-mono break-all">
                    {generatedWallet}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  This wallet address has been generated for the artist and will be permanently associated with their account. They can use this address to track their copyrights on the blockchain.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWalletDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmApprovalWithWallet}
              disabled={!generatedWallet}
            >
              Confirm & Approve Artist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVerifications;
