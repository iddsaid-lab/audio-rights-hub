
import React from 'react';
import { PlayCircle, Copyright, Clock, Music } from 'lucide-react';
import { formatDuration } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface AudioCardProps {
  id: string;
  title: string;
  artist: string;
  coverArt?: string;
  duration: number;
  genre?: string;
  copyrightStatus: 'pending' | 'approved' | 'rejected';
  playCount: number;
  onPlay: () => void;
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
  const getCopyrightBadge = () => {
    if (copyrightStatus === 'approved') {
      return <Badge variant="default" className="bg-green-600">Copyright Registered</Badge>;
    } else if (copyrightStatus === 'pending') {
      return <Badge variant="secondary" className="bg-amber-500">Pending</Badge>;
    } else {
      return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  return (
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
              onClick={onPlay} 
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
            <div className="text-xs text-gray-500">
              {playCount} plays
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCard;
