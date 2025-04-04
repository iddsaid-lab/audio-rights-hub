
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MusicIcon, Search, ArrowRight, Shield, FileCheck, User } from 'lucide-react';
import AudioCard from '@/components/audio/AudioCard';
import { mockAudios } from '@/data/mockData';
import AudioPlayer from '@/components/audio/AudioPlayer';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudio, setSelectedAudio] = useState(mockAudios[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const featuredAudios = mockAudios.slice(0, 4);

  const handleAudioPlay = (audioId: string) => {
    const audio = mockAudios.find(a => a.id === audioId);
    if (audio) {
      setSelectedAudio(audio);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-purple/90 to-brand-deep-purple pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <MusicIcon className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Protect Your Musical Creations
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              The official platform of the Copyright Society of Tanzania for registering, managing, and protecting your audio copyrights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" className="bg-white text-brand-purple hover:bg-white/90">
                  Browse Audio Library
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Register as an Artist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search for songs, artists, or copyright information..." 
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Featured Audios Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-10 flex justify-between items-center">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Music</h2>
            <Link to="/browse" className="flex items-center text-brand-purple hover:underline">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredAudios.map((audio) => (
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
            ))}
          </div>

          {/* Audio Player (shows when an audio is selected) */}
          {isPlaying && selectedAudio && (
            <div className="fixed bottom-0 left-0 right-0 z-10">
              <AudioPlayer
                audioUrl={selectedAudio.audioUrl}
                title={selectedAudio.title}
                artist={selectedAudio.artistName}
                coverArt={selectedAudio.coverArt}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How AudioRightsHub Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Protecting your musical creations is easy with our streamlined process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-14 w-14 bg-brand-light-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-7 w-7 text-brand-purple" />
              </div>
              <h3 className="text-xl font-medium mb-3">Register as an Artist</h3>
              <p className="text-gray-600">
                Create your artist account with your personal information and previous work samples for verification
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-14 w-14 bg-brand-light-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-brand-purple" />
              </div>
              <h3 className="text-xl font-medium mb-3">Get Verified</h3>
              <p className="text-gray-600">
                COSOTA officials will review your submission and verify your identity and credentials
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-14 w-14 bg-brand-light-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="h-7 w-7 text-brand-purple" />
              </div>
              <h3 className="text-xl font-medium mb-3">Register Copyrights</h3>
              <p className="text-gray-600">
                Upload your audio works and complete the copyright registration process with COSOTA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-purple py-16 px-4 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Music?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join hundreds of Tanzanian artists who have registered their work with COSOTA through AudioRightsHub
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-brand-purple hover:bg-white/90">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
