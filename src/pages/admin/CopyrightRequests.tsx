
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCopyrightRequests, mockAudios } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Music, Clock, FileCheck, Play as PlayIcon, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Play from '@/components/audio/Play';
import AudioPlayer from '@/components/audio/AudioPlayer';

const AdminCopyrightRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isPlayDialogOpen, setIsPlayDialogOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<typeof mockAudios[0] | null>(null);
  const [isBlockchainDialogOpen, setIsBlockchainDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [blockchainAddress, setBlockchainAddress] = useState<string | null>(null);
  
  const canProcess = user?.role === 'manager' || user?.role === 'officer';
  
  const pendingRequests = mockCopyrightRequests.filter(req => req.status === 'pending');
  const processedRequests = mockCopyrightRequests.filter(req => req.status !== 'pending');
  
  const handleApprove = (requestId: string) => {
    if (!canProcess) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to approve copyright requests.",
        variant: "destructive"
      });
      return;
    }

    // First open blockchain dialog
    setSelectedRequestId(requestId);
    setIsBlockchainDialogOpen(true);
  };
  
  const publishToBlockchain = async () => {
    if (!selectedRequestId) return;
    
    setIsPublishing(true);
    
    try {
      // Simulate blockchain publishing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a mock blockchain address
      const randomAddress = '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setBlockchainAddress(randomAddress);
      setIsPublishing(false);
    } catch (error) {
      toast({
        title: "Blockchain Publishing Failed",
        description: "There was an error publishing to the blockchain. Please try again.",
        variant: "destructive"
      });
      setIsPublishing(false);
    }
  };

  const confirmApprovalWithBlockchain = () => {
    if (!blockchainAddress || !selectedRequestId) return;
    
    toast({
      title: "Request Approved",
      description: "The copyright has been approved and published to the blockchain successfully.",
    });
    
    setIsBlockchainDialogOpen(false);
    setBlockchainAddress(null);
  };
  
  const openRejectDialog = (requestId: string) => {
    setSelectedRequestId(requestId);
    setReviewNotes('');
    setIsRejectDialogOpen(true);
  };
  
  const handleReject = () => {
    if (!canProcess || !selectedRequestId) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to reject copyright requests.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Request Rejected",
      description: "The copyright request has been rejected with feedback.",
    });
    
    setIsRejectDialogOpen(false);
  };
  
  const getAudio = (audioId: string) => {
    return mockAudios.find(audio => audio.id === audioId);
  };

  const handlePlayAudio = (audioId: string) => {
    const audio = getAudio(audioId);
    if (audio) {
      setSelectedAudio(audio);
      setIsPlayDialogOpen(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Copyright Requests</h1>
          <p className="text-gray-600">Review and process copyright registration requests</p>
        </div>
        <div>
          {!canProcess && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              View Only Mode - {user?.role}
            </Badge>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="processed">Processed ({processedRequests.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No pending copyright requests.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingRequests.map((request) => {
                const audio = getAudio(request.audioId);
                
                return (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Copyright Request</CardTitle>
                          <CardDescription>
                            Request ID: {request.id} | Submitted: {new Date(request.submissionDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          Pending Review
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="rounded-md flex items-center justify-center bg-gray-100 h-40 w-full md:w-1/3">
                            {audio?.coverArt ? (
                              <img src={audio.coverArt} alt={audio.title} className="h-full object-cover" />
                            ) : (
                              <Music className="h-16 w-16 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="w-full md:w-2/3 space-y-4">
                            <div>
                              <h3 className="font-medium">Audio: {audio?.title}</h3>
                              <p className="text-gray-600 mt-1">
                                Artist: {audio?.artistName}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">Genre</h3>
                                <p className="mt-1">{audio?.genre || 'Not specified'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                                <p className="mt-1">{audio?.duration ? `${Math.floor(audio.duration / 60)}:${(audio.duration % 60).toString().padStart(2, '0')}` : 'Unknown'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">Upload Date</h3>
                                <p className="mt-1">{audio?.uploadDate ? new Date(audio.uploadDate).toLocaleDateString() : 'Unknown'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">Play Count</h3>
                                <p className="mt-1">{audio?.playCount || 0}</p>
                              </div>
                            </div>
                            
                            <Button variant="outline" onClick={() => handlePlayAudio(request.audioId)}>
                              <PlayIcon className="mr-2 h-4 w-4" />
                              Listen to Audio
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-medium">Review Notes</h3>
                          <Textarea 
                            placeholder="Add notes about this copyright request..."
                            className="min-h-[100px]"
                            disabled={!canProcess}
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => openRejectDialog(request.id)}
                        disabled={!canProcess}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button 
                        onClick={() => handleApprove(request.id)}
                        disabled={!canProcess || !reviewNotes.trim()}
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
        
        <TabsContent value="processed">
          {processedRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No processed copyright requests.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {processedRequests.map((request) => {
                const audio = getAudio(request.audioId);
                const isApproved = request.status === 'approved';
                
                return (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Copyright Request</CardTitle>
                          <CardDescription>
                            Request ID: {request.id} | Processed: {request.reviewDate ? new Date(request.reviewDate).toLocaleDateString() : 'N/A'}
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
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="rounded-md flex items-center justify-center bg-gray-100 h-40 w-full md:w-1/3">
                            {audio?.coverArt ? (
                              <img src={audio.coverArt} alt={audio.title} className="h-full object-cover" />
                            ) : (
                              <Music className="h-16 w-16 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="w-full md:w-2/3 space-y-4">
                            <div>
                              <h3 className="font-medium">Audio: {audio?.title}</h3>
                              <p className="text-gray-600 mt-1">
                                Artist: {audio?.artistName}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">Reviewer</h3>
                                <p className="mt-1">{request.reviewerId || 'Not specified'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                                <p className="mt-1 capitalize">{request.paymentStatus}</p>
                              </div>
                            </div>

                            {isApproved && request.blockchainAddress && (
                              <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                                <h3 className="text-sm font-medium text-green-800 flex items-center">
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Blockchain Record
                                </h3>
                                <p className="mt-1 text-sm text-green-700 font-mono break-all">
                                  {request.blockchainAddress || '0xEe26845eEB53fa496B07D34F118a00F6a5C25078ad51C'}
                                </p>
                                <p className="mt-1 text-xs text-green-600">
                                  This copyright is permanently recorded on the blockchain and can be verified by anyone.
                                </p>
                              </div>
                            )}
                            
                            {request.reviewNotes && (
                              <div className="p-4 bg-gray-50 rounded-md">
                                <h3 className="font-medium">Review Notes</h3>
                                <p className="mt-1 text-sm">{request.reviewNotes}</p>
                              </div>
                            )}
                            
                            <Button variant="outline">
                              <FileCheck className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </div>
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
            <DialogTitle>Reject Copyright Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this copyright request. This feedback will be shared with the artist.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea 
            placeholder="Enter reason for rejection"
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="min-h-[100px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!reviewNotes.trim()}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audio Play Dialog */}
      <Dialog open={isPlayDialogOpen} onOpenChange={setIsPlayDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedAudio?.title}
            </DialogTitle>
            <DialogDescription>
              By {selectedAudio?.artistName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAudio && (
            <AudioPlayer 
              audioUrl="/sample-audio.mp3" 
              title={selectedAudio.title}
              artist={selectedAudio.artistName}
              coverArt={selectedAudio.coverArt}
              onEnded={() => {
                toast({
                  title: "Playback Ended",
                  description: `"${selectedAudio.title}" has finished playing`,
                });
                setIsPlayDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Blockchain Publishing Dialog */}
      <Dialog open={isBlockchainDialogOpen} onOpenChange={(open) => {
        setIsBlockchainDialogOpen(open);
        if (!open) {
          setBlockchainAddress(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish to Blockchain</DialogTitle>
            <DialogDescription>
              Publish this copyright to the blockchain to create a permanent and verifiable record.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!blockchainAddress ? (
              <div className="flex flex-col items-center justify-center p-6">
                <Share2 className="h-16 w-16 text-brand-purple mb-4" />
                <p className="text-center text-gray-600 mb-4">
                  This process will publish the audio details and copyright information to the blockchain, creating a permanent and verifiable record of ownership.
                </p>
                <Button 
                  onClick={publishToBlockchain} 
                  disabled={isPublishing}
                  className="w-full"
                >
                  {isPublishing ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      Publishing to Blockchain...
                    </>
                  ) : (
                    'Publish to Blockchain'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                  <h3 className="font-medium text-green-800 mb-2">Successfully Published</h3>
                  <p className="text-sm text-green-700 font-mono break-all">
                    {blockchainAddress}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  This copyright has been successfully published to the blockchain. This creates a permanent record that can be used to verify ownership and authenticity.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockchainDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmApprovalWithBlockchain}
              disabled={!blockchainAddress}
            >
              Confirm & Approve Copyright
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCopyrightRequests;
