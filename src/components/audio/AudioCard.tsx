
import React, { useState } from 'react';
import { PlayCircle, Copyright, Clock, Music, Info } from 'lucide-react';
import { formatDuration } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { useToast } from '@/hooks/use-toast';

interface AudioCardProps {
  id: string;
  title: string;
  artist: string;
  coverArt?: string;
  duration: number;
  genre?: string;
  copyrightStatus: 'pending' | 'approved' | 'rejected';
  playCount: number;
  onPlay?: () => void;
}

const AudioCard: React.FC<AudioCardProps> = ({
  id,
  title,
  artist,
  coverArt,
  duration,
  genre,
  copyrightStatus,
  playCount,
  onPlay
}) => {
  const [isPlayDialogOpen, setIsPlayDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const getCopyrightBadge = () => {
    if (copyrightStatus === 'approved') {
      return <Badge variant="default" className="bg-green-600">Copyright Registered</Badge>;
    } else if (copyrightStatus === 'pending') {
      return <Badge variant="secondary" className="bg-amber-500">Pending</Badge>;
    } else {
      return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    } else {
      setIsPlayDialogOpen(true);
    }
  };

  const handleDetailsClick = () => {
    setIsDetailsDialogOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex flex-col h-full">
          <div className="relative group">
            {coverArt ? (
              <img 
                src={coverArt} 
                alt={title} 
                className="w-full aspect-square object-cover" 
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                <Music className="h-16 w-16 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
              <Button 
                onClick={handlePlay} 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white text-brand-purple rounded-full h-12 w-12 transform scale-90 group-hover:scale-100 transition-all"
              >
                <PlayCircle className="h-8 w-8" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 flex flex-col flex-grow">
            <Link to={`/audio/${id}`} className="hover:text-brand-purple">
              <h3 className="font-medium text-lg mb-1 line-clamp-1">{title}</h3>
            </Link>
            <p className="text-sm text-gray-600 mb-3">{artist}</p>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDuration(duration)}</span>
              </div>
              
              {genre && (
                <Badge variant="outline" className="text-xs font-normal">
                  {genre}
                </Badge>
              )}
            </div>
            
            <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <Copyright className="h-3.5 w-3.5 mr-1 text-gray-500" />
                {getCopyrightBadge()}
              </div>
              <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500" onClick={handleDetailsClick}>
                <Info className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Player Dialog */}
      <Dialog open={isPlayDialogOpen} onOpenChange={setIsPlayDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {title}
            </DialogTitle>
            <DialogDescription>
              By {artist}
            </DialogDescription>
          </DialogHeader>
          
          <AudioPlayer 
            audioUrl="/sample-audio.mp3" 
            title={title}
            artist={artist}
            coverArt={coverArt}
            onEnded={() => {
              toast({
                title: "Playback Ended",
                description: `"${title}" has finished playing`,
              });
              setIsPlayDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Audio Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Audio Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about "{title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
                {coverArt ? (
                  <img src={coverArt} alt={title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                    <Music className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-lg">{title}</h3>
                <p className="text-gray-600">By {artist}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-gray-500">Duration</h3>
                <p>{formatDuration(duration)}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Genre</h3>
                <p>{genre || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Play Count</h3>
                <p>{playCount} plays</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Copyright Status</h3>
                <p className="capitalize">{copyrightStatus}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium">Copyright Information</h3>
              <p className="mt-1 text-sm text-gray-600">
                {copyrightStatus === 'approved' 
                  ? 'This audio is protected by copyright law and registered with COSOTA.' 
                  : copyrightStatus === 'pending'
                    ? 'This audio is currently under review for copyright registration.'
                    : 'This audio has been rejected for copyright registration.'}
              </p>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                Close
              </Button>
              <Button variant="default" onClick={handlePlay}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Play Audio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AudioCard;
