
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { mockCopyrightRequests, mockAudios } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Music, FileCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const AdminApprovals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false);
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');
  
  const isManager = user?.role === 'manager';
  
  // Filter for copyright requests that have been paid but not yet approved or rejected
  const pendingApprovals = mockCopyrightRequests.filter(
    req => req.status === 'pending' && req.paymentStatus !== 'pending'
  );
  
  const handleApprove = (requestId: string) => {
    if (!isManager) {
      toast({
        title: "Permission Denied",
        description: "Only managers can approve copyright registrations.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Copyright Approved",
      description: "The copyright has been successfully registered.",
    });
  };
  
  const openRejectDialog = (requestId: string) => {
    setSelectedRequestId(requestId);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };
  
  const handleReject = () => {
    if (!isManager || !selectedRequestId) {
      toast({
        title: "Permission Denied",
        description: "Only managers can reject copyright registrations.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Copyright Rejected",
      description: "The copyright request has been rejected with feedback.",
    });
    
    setIsRejectDialogOpen(false);
  };
  
  const getAudio = (audioId: string) => {
    return mockAudios.find(audio => audio.id === audioId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Final Approvals</h1>
          <p className="text-gray-600">Approve or reject copyright registrations</p>
        </div>
        <div>
          {!isManager && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              View Only Mode - {user?.role}
            </Badge>
          )}
        </div>
      </div>
      
      {pendingApprovals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Clock className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500 text-center">No copyright registrations pending final approval.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingApprovals.map((request) => {
            const audio = getAudio(request.audioId);
            
            return (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Copyright Registration Approval</CardTitle>
                      <CardDescription>
                        Request ID: {request.id} | Submitted: {new Date(request.submissionDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={
                      request.paymentStatus === 'paid' 
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }>
                      Payment {request.paymentStatus === 'paid' ? 'Paid' : 'Waived'}
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
                            <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                            <p className="mt-1">{request.paymentStatus === 'paid' ? 'Paid' : 'Waived'}</p>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full md:w-auto">
                          <FileCheck className="mr-2 h-4 w-4" />
                          View Copyright Details
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium">Officer Review Notes</h3>
                      <p className="mt-1 text-gray-600">
                        {request.reviewNotes || 'No review notes provided by the copyright officer.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => openRejectDialog(request.id)}
                    disabled={!isManager}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApprove(request.id)}
                    disabled={!isManager}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve & Register
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Copyright Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this copyright registration. This feedback will be shared with the artist.
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
              Reject Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovals;
