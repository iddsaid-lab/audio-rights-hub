
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Music } from 'lucide-react';
import AudioCard from '@/components/audio/AudioCard';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { mockAudios } from '@/data/mockData';

const BrowseAudio = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortOption, setSortOption] = useState('recent');
  const [copyrightFilter, setCopyrightFilter] = useState('all');
  const [selectedAudio, setSelectedAudio] = useState<typeof mockAudios[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const genres = [...new Set(mockAudios.map(audio => audio.genre).filter(Boolean))];

  // Filter and sort audios
  const filteredAudios = mockAudios.filter(audio => {
    // Apply search filter
    if (searchQuery && !audio.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !audio.artistName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply genre filter
    if (selectedGenre !== 'all' && audio.genre !== selectedGenre) {
      return false;
    }
    
    // Apply copyright status filter
    if (copyrightFilter !== 'all' && audio.copyrightStatus !== copyrightFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Apply sorting
    if (sortOption === 'recent') {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    } else if (sortOption === 'popular') {
      return b.playCount - a.playCount;
    } else if (sortOption === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleAudioPlay = (audioId: string) => {
    const audio = mockAudios.find(a => a.id === audioId);
    if (audio) {
      setSelectedAudio(audio);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-purple text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold flex items-center">
              <Music className="mr-2 h-8 w-8" />
              Audio Library
            </h1>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="border-white text-white hover:bg-white/10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search by title, artist..." 
              className="pl-10 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Filter Row */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => 
                    genre && <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Copyright Status</label>
              <Select value={copyrightFilter} onValueChange={setCopyrightFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Copyright Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Registered</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Sort By</label>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {/* Results */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">
            {filteredAudios.length} {filteredAudios.length === 1 ? 'result' : 'results'} found
          </h2>
        </div>
        
        {/* Audio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAudios.length > 0 ? (
            filteredAudios.map((audio) => (
              <AudioCard 
                key={audio.id}
                id={audio.id}
                title={audio.title}
                artist={audio.artistName}
                coverArt={audio.coverArt}
                duration={audio.duration}
                genre={audio.genre}
                copyrightStatus={audio.copyrightStatus}
                playCount={audio.playCount}
                onPlay={() => handleAudioPlay(audio.id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center p-8 bg-white rounded-lg border border-gray-200">
              <Music className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium mb-2">No audio tracks found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Audio Player (fixed at bottom) */}
      {selectedAudio && (
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <AudioPlayer
            audioUrl={selectedAudio.audioUrl}
            title={selectedAudio.title}
            artist={selectedAudio.artistName}
            coverArt={selectedAudio.coverArt}
            onEnded={() => setSelectedAudio(null)}
          />
        </div>
      )}
    </div>
  );
};

export default BrowseAudio;
