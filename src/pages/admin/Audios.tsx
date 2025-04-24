
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ApiService from '../../services/ApiService';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Music, FileCheck, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminAudios = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isPlayDialogOpen, setIsPlayDialogOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<any | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [audios, setAudios] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch audios from backend
  React.useEffect(() => {
    ApiService.getAllAudios()
      .then(setAudios)
      .catch(() => setAudios([]));
  }, []);

  // Filter audios based on search query
  const filteredAudios = audios.filter(audio => 
    audio.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audio.artistName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const approvedAudios = filteredAudios.filter(audio => audio.copyrightStatus === 'approved');
  const pendingAudios = filteredAudios.filter(audio => audio.copyrightStatus === 'pending');
  const rejectedAudios = filteredAudios.filter(audio => audio.copyrightStatus === 'rejected');

  const displayAudios = activeTab === 'all' 
    ? filteredAudios 
    : activeTab === 'approved' 
      ? approvedAudios 
      : activeTab === 'pending' 
        ? pendingAudios 
        : rejectedAudios;

  const openPlayDialog = (audio: any) => {
    setSelectedAudio(audio);
    setIsPlayDialogOpen(true);
  };

  const openReviewDialog = (audio: any) => {
    setSelectedAudio(audio);
    setReviewNotes('');
    setIsReviewDialogOpen(true);
  };

  const handleApprove = () => {
    if (!selectedAudio) return;

    toast({
      title: "Copyright Approved",
      description: `Copyright review for "${selectedAudio.title}" has been completed.`,
    });

    setIsReviewDialogOpen(false);
  };

  const handleReject = () => {
    if (!selectedAudio || !reviewNotes.trim()) return;

    toast({
      title: "Copyright Rejected",
      description: `"${selectedAudio.title}" has been rejected with feedback.`,
      variant: "destructive"
    });

    setIsReviewDialogOpen(false);
  };

  const handleDetailsClick = (audio: any) => {
    toast({
      title: "Audio Details",
      description: `Viewing details for "${audio.title}"`,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Audio Database</h1>
          <p className="text-gray-600">Browse and manage all audio recordings</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search audio by title or artist name"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Audios ({filteredAudios.length})</TabsTrigger>
          <TabsTrigger value="approved">Copyrighted ({approvedAudios.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingAudios.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedAudios.length})</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayAudios.map((audio) => (
          <Card key={audio.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{audio.title}</CardTitle>
                  <CardDescription>By {audio.artistName}</CardDescription>
                </div>
                <Badge className={
                  audio.copyrightStatus === 'approved' 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : audio.copyrightStatus === 'rejected'
                      ? "bg-red-100 text-red-800 border-red-200"
                      : "bg-amber-100 text-amber-800 border-amber-200"
                }>
                  {audio.copyrightStatus === 'approved' 
                    ? 'Copyrighted' 
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
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-medium text-gray-500">Upload Date</h3>
                    <p>{new Date(audio.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Duration</h3>
                    <p>{Math.floor(audio.duration / 60)}:{(audio.duration % 60).toString().padStart(2, '0')}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Genre</h3>
                    <p>{audio.genre || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Play Count</h3>
                    <p>{audio.playCount}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={() => openPlayDialog(audio)}>
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </Button>
                  {audio.copyrightStatus === 'approved' ? (
                    <Button variant="outline" className="flex-1" onClick={() => handleDetailsClick(audio)}>
                      <Info className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                  ) : audio.copyrightStatus === 'pending' ? (
                    <Button variant="outline" className="flex-1" onClick={() => openReviewDialog(audio)}>
                      <FileCheck className="mr-2 h-4 w-4" />
                      Review
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1" onClick={() => handleDetailsClick(audio)}>
                      <Info className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {displayAudios.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <Music className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No audios found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search query</p>
          </div>
        )}
      </div>

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
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Copyright</DialogTitle>
            <DialogDescription>
              Review and provide feedback for "{selectedAudio?.title}" by {selectedAudio?.artistName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea 
              placeholder="Add review notes or feedback about this audio submission..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!reviewNotes.trim()}
            >
              Reject
            </Button>
            <Button onClick={handleApprove}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAudios;
