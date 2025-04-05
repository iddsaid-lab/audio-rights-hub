
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockAudios } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Music, FileCheck } from 'lucide-react';

const AdminAudios = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Filter audios based on search query
  const filteredAudios = mockAudios.filter(audio => 
    audio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audio.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const approvedAudios = filteredAudios.filter(audio => audio.copyrightStatus === 'approved');
  const pendingAudios = filteredAudios.filter(audio => audio.copyrightStatus === 'pending');
  const rejectedAudios = filteredAudios.filter(audio => audio.copyrightStatus === 'rejected');

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
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Badge className="bg-gray-100 text-gray-800 border-gray-200 px-4 py-2 text-sm font-medium">
          All Audios: {filteredAudios.length}
        </Badge>
        <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm font-medium">
          Copyrighted: {approvedAudios.length}
        </Badge>
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2 text-sm font-medium">
          Pending: {pendingAudios.length}
        </Badge>
        <Badge className="bg-red-100 text-red-800 border-red-200 px-4 py-2 text-sm font-medium">
          Rejected: {rejectedAudios.length}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAudios.map((audio) => (
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
                  <Button variant="outline" className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </Button>
                  {audio.copyrightStatus === 'approved' ? (
                    <Button variant="outline" className="flex-1">
                      <FileCheck className="mr-2 h-4 w-4" />
                      Copyright
                    </Button>
                  ) : audio.copyrightStatus === 'pending' ? (
                    <Button variant="outline" className="flex-1">
                      <FileCheck className="mr-2 h-4 w-4" />
                      Review
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1">
                      <FileCheck className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredAudios.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <Music className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No audios found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAudios;
