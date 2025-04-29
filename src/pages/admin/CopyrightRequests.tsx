import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import GeneratePaymentButton from './components/GeneratePaymentButton';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiService from '../../services/ApiService';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Music, 
  Clock, 
  FileCheck, 
  Play as PlayIcon, 
  Share2, 
  ArrowUpRight, 
  ShieldAlert,
  Search,
  AlertTriangle,
  Hash,
  Fingerprint
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Play from '@/components/audio/Play';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminCopyrightRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isPlayDialogOpen, setIsPlayDialogOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<any | null>(null);
  const [isBlockchainDialogOpen, setIsBlockchainDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [blockchainAddress, setBlockchainAddress] = useState<string | null>(null);
  
  // New states for audio verification process
  const [isHashGeneratorDialogOpen, setIsHashGeneratorDialogOpen] = useState(false);
  const [isHashVerificationDialogOpen, setIsHashVerificationDialogOpen] = useState(false);
  const [isEscalateDialogOpen, setIsEscalateDialogOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [hashGenerationProgress, setHashGenerationProgress] = useState(0);
  const [hashVerificationProgress, setHashVerificationProgress] = useState(0);
  const [generatedHash, setGeneratedHash] = useState<string | null>(null);
  const [hashMatchFound, setHashMatchFound] = useState(false);
  const [similarAudios, setSimilarAudios] = useState<Array<{
    id: string;
    title: string;
    artistName: string;
    ownerName: string;
    similarityScore: number;
  }>>([]);
  
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const PAYMENT_METHODS = [
    { label: 'M-Pesa', value: 'mpesa', number: '123456' },
    { label: 'Bank Transfer', value: 'bank', number: '9876543210' },
  ];
  const [invoiceForm, setInvoiceForm] = useState({
    copyrightRequestId: '',
    amount: 50,
    paymentMethod: PAYMENT_METHODS[0].value,
    paymentNumber: PAYMENT_METHODS[0].number,
  });
  const [submittingInvoice, setSubmittingInvoice] = useState(false);

  const isOfficer = user?.role === 'officer';
  const isManager = user?.role === 'manager';
  const canProcess = isOfficer || isManager;
  const canPublishToBlockchain = isManager;
  
  const [copyrightAudioPairs, setCopyrightAudioPairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    ApiService.getAllCopyrightsWithAudio()
      .then((pairs) => {
        console.log('[DEBUG] copyrightAudioPairs:', pairs);
        setCopyrightAudioPairs(pairs);
      })
      .catch(() => setCopyrightAudioPairs([]))
      .finally(() => setLoading(false));
  }, []);

  // Helper arrays for filtering
  const pendingRequests = copyrightAudioPairs.filter(pair => pair.copyright.status === 'pending');
  const escalatedRequests = copyrightAudioPairs.filter(pair => pair.copyright.status === 'escalated');
  const processedRequests = copyrightAudioPairs.filter(pair => pair.copyright.status !== 'pending' && pair.copyright.status !== 'escalated');
  
  const handleApprove = (requestId: string) => {
    if (!canProcess) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to approve copyright requests.",
        variant: "destructive"
      });
      return;
    }

    if (isManager) {
      // Managers can publish directly to blockchain
      setSelectedRequestId(requestId);
      setIsBlockchainDialogOpen(true);
    } else if (isOfficer) {
      // Officers must generate hash first
      setSelectedRequestId(requestId);
      setIsHashGeneratorDialogOpen(true);
    }
  };
  
  const startHashGeneration = async () => {
    if (!selectedRequestId) return;
    setHashGenerationProgress(0);
    setGeneratedHash(null);

    // Find the audio file associated with the selected copyright request
    const copyrightAudioPair = copyrightAudioPairs.find(pair => pair.copyright.id === selectedRequestId);
    if (!copyrightAudioPair || !copyrightAudioPair.audio) {
      toast({
        title: "Audio Not Found",
        description: "No audio file is linked to this copyright request.",
        variant: "destructive"
      });
      return;
    }
    const audioMeta = copyrightAudioPair.audio;
    if (!audioMeta || !audioMeta.fileUrl) {
      toast({
        title: "Audio File Missing",
        description: "The audio file could not be located.",
        variant: "destructive"
      });
      return;
    }

    // Prepare audio file URL and name for hash generation
    // Call the backend AI hash generation API
    try {
      setHashGenerationProgress(40);
      // Ensure full URL for audio file
      const audioFileUrl = audioMeta.fileUrl.startsWith('http') ? audioMeta.fileUrl : `http://localhost:4000${audioMeta.fileUrl}`;
      const fileName = audioMeta.fileUrl.split('/').pop() || 'audio.mp3';
      const token = ApiService.getToken();
      const result = await ApiService.generateAudioHash(audioFileUrl, fileName, token);
      
      // console.log(audioMeta)
      setHashGenerationProgress(100);
      setGeneratedHash(result.hash || result.audioHash || JSON.stringify(result));
      await ApiService.updateAudioHash(audioMeta.id,result.hash || result.audioHash || JSON.stringify(result));
      toast({
        title: "Hash Generated",
        description: "Audio hash has been successfully generated using AI.",
      });
    } catch (err: any) {
      setHashGenerationProgress(0);
      toast({
        title: "Hash Generation Failed",
        description: err?.message || "Could not generate hash for the audio file.",
        variant: "destructive"
      });
    }
  };

  const verifyHashInBlockchain = async () => {
    if (!selectedRequestId || !generatedHash) return;

    setHashVerificationProgress(0);
    setHashMatchFound(false);
    setSimilarAudios([]);

    try {
      setHashVerificationProgress(30);
      // Call the real API to check hash existence
      const token = ApiService.getToken();
      const { exists } = await ApiService.checkHashExistsInBlockchain(generatedHash, token);
      setHashVerificationProgress(100);
      setHashMatchFound(exists);
      if (exists) {
        toast({
          title: "Copyright Exists",
          description: "This audio hash is already registered on the blockchain.",
          variant: "destructive"
        });
        // Optionally: fetch and display similar audios if your backend supports it
      } else {
        toast({
          title: "Verification Complete",
          description: "No similar content found. Audio appears to be original.",
        });
      }
    } catch (err: any) {
      setHashVerificationProgress(0);
      toast({
        title: "Blockchain Check Failed",
        description: err?.message || "Could not check the blockchain for this hash.",
        variant: "destructive"
      });
    }
  };

  const handleEscalateToManager = async () => {
    if (!selectedRequestId || !escalationReason) return;
    try {
      const token = ApiService.getToken();
      await ApiService.escalateCopyrightRequest(Number(selectedRequestId), escalationReason, token);
      toast({
        title: "Request Escalated",
        description: "The copyright request has been escalated to a manager for review.",
      });
      // Optionally refresh the copyrightAudioPairs list to reflect update
      ApiService.getAllCopyrightsWithAudio(token)
        .then((pairs) => setCopyrightAudioPairs(pairs))
        .catch(() => {});
      setIsEscalateDialogOpen(false);
      setEscalationReason('');
    } catch (err: any) {
      toast({
        title: "Escalation Failed",
        description: err?.message || "Could not escalate the request.",
        variant: "destructive"
      });
    }
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
    // Find the audio object embedded in copyrightAudioPairs
    for (const pair of copyrightAudioPairs) {
      if (pair.audio && pair.audio.id === audioId) return pair.audio;
    }
    return null;
  };

  const openInvoiceDialog = (requestId: string, amount: number) => {
    const defaultMethod = PAYMENT_METHODS[0];
    setInvoiceForm({
      copyrightRequestId: requestId,
      amount: amount,
      paymentMethod: defaultMethod.value,
      paymentNumber: defaultMethod.number,
    });
    setIsInvoiceDialogOpen(true);
  };

  const handleInvoiceFormChange = (field: string, value: any) => {
    if (field === 'paymentMethod') {
      const method = PAYMENT_METHODS.find(m => m.value === value);
      setInvoiceForm(form => ({ ...form, paymentMethod: value, paymentNumber: method?.number || '' }));
    } else {
      setInvoiceForm(form => ({ ...form, [field]: value }));
    }
  };

  const handleInvoiceSubmit = async () => {
    setSubmittingInvoice(true);
    try {
      await ApiService.createPayment({
        copyrightRequestId: invoiceForm.copyrightRequestId,
        amount: invoiceForm.amount,
        paymentMethod: invoiceForm.paymentMethod,
        paymentNumber: invoiceForm.paymentNumber
      }, ApiService.getToken());
      setIsInvoiceDialogOpen(false);
      toast({ title: 'Invoice Created', description: 'Payment invoice generated for artist.' });
      // TODO: Refresh copyright requests/payments if needed
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to create invoice', variant: 'destructive' });
    } finally {
      setSubmittingInvoice(false);
    }
  };

  const handlePlayAudio = (audioId: string) => {
    const audio = getAudio(audioId);
    if (audio) {
      setSelectedAudio(audio);
      setIsPlayDialogOpen(true);
    }
  };

  const handleApprovePayment = async (copyrightRequestId: number) => {
    try {
      await ApiService.approveCopyrightPayment(copyrightRequestId);
      toast({ title: 'Payment Approved', description: 'Copyright payment marked as paid.' });
      // Refresh copyright requests
      const pairs = await ApiService.getAllCopyrightsWithAudio();
      setCopyrightAudioPairs(pairs);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to approve payment', variant: 'destructive' });
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
          {isOfficer && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Officer Verification Mode
            </Badge>
          )}
          {isManager && (
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              Manager Approval Mode
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
          {copyrightAudioPairs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No pending copyright requests.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingRequests.map(({ copyright, audio }) => (
                <Card key={copyright.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Copyright Request</CardTitle>
                        <CardDescription>
                          Request ID: {copyright.id} | Audio ID: {audio?.id} | Artist ID: {audio?.artistId}
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
                          <Music className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="w-full md:w-2/3 space-y-4">
                          <div>
                            <h3 className="font-medium">Audio Title: {audio?.title}</h3>
                            <p className="text-gray-600 mt-1">
                              Audio File URL: {audio?.fileUrl}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
                              <p className="mt-1">{audio?.id}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Copyright ID</h3>
                              <p className="mt-1">{copyright?.id}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Copyright Status</h3>
                              <p className="mt-1">{copyright?.status}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Audio File URL</h3>
                              <p className="mt-1">{audio?.fileUrl}</p>
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => handlePlayAudio(audio?.id)}>
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
                    {user?.role === 'cashier' && !copyright.hasPayment && (
                      <Button onClick={() => openInvoiceDialog(copyright.id, 50)}>
                        Generate Invoice
                      </Button>
                    )}
                    {user?.role === 'cashier' && copyright.hasPayment && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Payment Made
                      </Badge>
                    )}
                    {['cashier', 'admin'].includes(user?.role) && copyright.paymentStatus !== 'paid' && (
                      <Button onClick={() => handleApprovePayment(copyright.id)}>
                        Approve Payment
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => openRejectDialog(copyright.id)}
                      disabled={!canProcess}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleApprove(copyright.id)}
                      disabled={copyright.paymentStatus !== 'paid' || !reviewNotes.trim()}
                    >
                      {isOfficer ? (
                        <>
                          <Fingerprint className="mr-2 h-4 w-4" />
                          Verify Audio
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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
              {processedRequests.map(({ copyright, audio }) => {
                const isApproved = copyright.status === 'approved';
                return (
                  <Card key={copyright.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Copyright Request</CardTitle>
                          <CardDescription>
                            Request ID: {copyright.id} | Processed: {copyright.reviewDate ? new Date(copyright.reviewDate).toLocaleDateString() : 'N/A'}
                          </CardDescription>
                        </div>
                        <Badge className={
                          copyright.status === 'processed' ? "bg-blue-100 text-blue-800 border-blue-200"
                          : copyright.status === 'verified' ? "bg-green-100 text-green-800 border-green-200"
                          : copyright.status === 'rejected' ? "bg-red-100 text-red-800 border-red-200"
                          : copyright.status === 'completed' ? "bg-purple-100 text-purple-800 border-purple-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                        }>
                          {copyright.status.charAt(0).toUpperCase() + copyright.status.slice(1)}
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
                              <p className="text-gray-600 mt-1">
                                Audio File URL: {audio?.fileUrl}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">Reviewer</h3>
                                <p className="mt-1">{copyright.reviewerId || 'Not specified'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                                <p className="mt-1 capitalize">{copyright.paymentStatus}</p>
                                {['cashier', 'admin'].includes(user?.role) && copyright.paymentStatus !== 'paid' && (
                                  <Button className="mt-2" onClick={() => handleApprovePayment(copyright.id)}>
                                    Approve Payment
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {isApproved && copyright.audioHash && (
                              <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                                <h3 className="text-sm font-medium text-blue-800 flex items-center">
                                  <Fingerprint className="h-4 w-4 mr-2" />
                                  Audio Hash
                                </h3>
                                <p className="mt-1 text-sm text-blue-700 font-mono break-all">
                                  {copyright.audioHash}
                                </p>
                              </div>
                            )}

                            {isApproved && copyright.blockchainAddress && (
                              <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                                <h3 className="text-sm font-medium text-green-800 flex items-center">
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Blockchain Record
                                </h3>
                                <p className="mt-1 text-sm text-green-700 font-mono break-all">
                                  {copyright.blockchainAddress}
                                </p>
                                <p className="mt-1 text-xs text-green-600">
                                  This copyright is permanently recorded on the blockchain and can be verified by anyone.
                                </p>
                              </div>
                            )}
                            
                            {copyright.reviewNotes && (
                              <div className="p-4 bg-gray-50 rounded-md">
                                <h3 className="font-medium">Review Notes</h3>
                                <p className="mt-1 text-sm">{copyright.reviewNotes}</p>
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
      
      {/* Reject Dialog */}
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

      {/* Hash Generator Dialog */}
      <Dialog open={isHashGeneratorDialogOpen} onOpenChange={(open) => {
        setIsHashGeneratorDialogOpen(open);
        if (!open) {
          setGeneratedHash(null);
          setHashGenerationProgress(0);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Audio Hash</DialogTitle>
            <DialogDescription>
              Generate a unique fingerprint for this audio file to verify its originality.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!generatedHash ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-4">
                  <Fingerprint className="h-16 w-16 text-brand-purple mb-4" />
                  <p className="text-center text-gray-600 mb-4">
                    This process will analyze the audio file and generate a unique hash that identifies this specific audio content.
                  </p>
                </div>
                
                {hashGenerationProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing audio patterns...</span>
                      <span>{Math.round(hashGenerationProgress)}%</span>
                    </div>
                    <Progress value={hashGenerationProgress} className="h-2" />
                  </div>
                )}
                
                <Button 
                  onClick={startHashGeneration} 
                  disabled={hashGenerationProgress > 0 && hashGenerationProgress < 100}
                  className="w-full"
                >
                  {hashGenerationProgress > 0 && hashGenerationProgress < 100 ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      Generating Hash...
                    </>
                  ) : (
                    'Generate Audio Hash'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Hash Generated Successfully</h3>
                  <p className="text-sm text-blue-700 font-mono break-all">
                    {generatedHash}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  This unique hash is a digital fingerprint of the audio file. The next step is to check if this hash (or similar ones) already exists in the blockchain.
                </p>
                <Button 
                  onClick={() => {
                    setIsHashGeneratorDialogOpen(false);
                    setIsHashVerificationDialogOpen(true);
                  }}
                  className="w-full"
                >
                  Continue to Verification
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hash Verification Dialog */}
      <Dialog open={isHashVerificationDialogOpen} onOpenChange={(open) => {
        setIsHashVerificationDialogOpen(open);
        if (!open) {
          setHashVerificationProgress(0);
          setHashMatchFound(false);
          setSimilarAudios([]);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Audio Originality</DialogTitle>
            <DialogDescription>
              Checking the blockchain for any similar audio fingerprints.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {hashVerificationProgress < 100 ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-4">
                  <Search className="h-16 w-16 text-brand-purple mb-4" />
                  <p className="text-center text-gray-600 mb-4">
                    Searching the blockchain for any matching or similar audio fingerprints...
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Searching blockchain records...</span>
                    <span>{Math.round(hashVerificationProgress)}%</span>
                  </div>
                  <Progress value={hashVerificationProgress} className="h-2" />
                </div>
                
                <Button 
                  onClick={verifyHashInBlockchain} 
                  disabled={hashVerificationProgress > 0}
                  className="w-full"
                >
                  {hashVerificationProgress > 0 ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      Verifying Originality...
                    </>
                  ) : (
                    'Start Verification'
                  )}
                </Button>
              </div>
            ) : hashMatchFound ? (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Potential Copyright Match</AlertTitle>
                  <AlertDescription>
                    Similar audio content has been found in the blockchain. This may indicate a copyright conflict.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Similar Audio Content</h3>
                  {similarAudios.map(audio => (
                    <div key={audio.id} className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{audio.title}</h4>
                        <Badge className="bg-red-100 text-red-800">
                          {audio.similarityScore}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">By {audio.artistName}</p>
                      <p className="text-sm text-gray-500 mt-1">Owned by: {audio.ownerName}</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <PlayIcon className="h-3 w-3 mr-1" /> Listen to Sample
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-4">
                    Due to the similarity match, this request should be escalated to a manager for review.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => {
                      setIsHashVerificationDialogOpen(false);
                      setIsEscalateDialogOpen(true);
                    }}
                    className="w-full"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Escalate to Manager
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsHashVerificationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>No Copyright Conflicts Found</AlertTitle>
                  <AlertDescription>
                    No similar audio content was found in the blockchain. This appears to be original content.
                  </AlertDescription>
                </Alert>
                
                <p className="text-sm text-gray-600">
                  Since no similar content was found, you can proceed with escalating this copyright request to a manager for final approval and blockchain publishing.
                </p>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => {
                      setIsHashVerificationDialogOpen(false);
                      setIsEscalateDialogOpen(true);
                    }}
                    className="w-full"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Escalate to Manager
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsHashVerificationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Escalate to Manager Dialog */}
      <Dialog open={isEscalateDialogOpen} onOpenChange={setIsEscalateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalate to Manager</DialogTitle>
            <DialogDescription>
              Provide details for the manager who will review this copyright request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Escalation Reason</h3>
              <Textarea 
                placeholder="Explain why this request needs manager review..."
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            {hashMatchFound && similarAudios.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <h3 className="text-sm font-medium text-amber-800">Similar Content Summary</h3>
                <ul className="list-disc list-inside text-sm text-amber-700 mt-1">
                  {similarAudios.map(audio => (
                    <li key={audio.id}>
                      {audio.title} by {audio.artistName} ({audio.similarityScore}% match)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEscalateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEscalateToManager}
              disabled={!escalationReason.trim()}
            >
              Escalate Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blockchain Publishing Dialog (Manager Only) */}
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
                  disabled={isPublishing || !canPublishToBlockchain}
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
              disabled={!blockchainAddress || !canPublishToBlockchain}
            >
              Confirm & Approve Copyright
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Payment Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Amount</label>
              <Input type="number" value={invoiceForm.amount} onChange={e => handleInvoiceFormChange('amount', e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Payment Method</label>
              <Select value={invoiceForm.paymentMethod} onValueChange={val => handleInvoiceFormChange('paymentMethod', val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(method => (
                    <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Payment Number</label>
              <Input value={invoiceForm.paymentNumber} disabled />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInvoiceSubmit} disabled={submittingInvoice || !invoiceForm.paymentNumber}>
              {submittingInvoice ? 'Submitting...' : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCopyrightRequests;