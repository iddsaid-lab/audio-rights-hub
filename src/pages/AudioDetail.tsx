
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { mockAudios, mockCopyrights, formatDuration } from '@/data/mockData';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { Music, Calendar, FileCheck, User, Clock, BarChart3, Copyright, ExternalLink, List } from 'lucide-react';

const AudioDetail = () => {
  const { id } = useParams();
  const [audio, setAudio] = useState<typeof mockAudios[0] | null>(null);
  const [copyright, setCopyright] = useState<typeof mockCopyrights[0] | null>(null);
  
  useEffect(() => {
    // Find the audio with matching ID
    const foundAudio = mockAudios.find(a => a.id === id);
    if (foundAudio) {
      setAudio(foundAudio);
      
      // Find related copyright if exists
      if (foundAudio.copyrightId) {
        const foundCopyright = mockCopyrights.find(c => c.id === foundAudio.copyrightId);
        if (foundCopyright) {
          setCopyright(foundCopyright);
        }
      }
    }
  }, [id]);
  
  if (!audio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Audio Not Found</h1>
          <p className="text-gray-600 mb-6">The audio you're looking for doesn't exist or has been removed.</p>
          <Link to="/browse">
            <Button>Browse All Audios</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-brand-purple to-brand-deep-purple text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              {audio.coverArt ? (
                <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={audio.coverArt} 
                    alt={audio.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ) : (
                <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center shadow-lg">
                  <Music className="h-24 w-24 opacity-60" />
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {audio.genre && (
                  <Badge variant="outline" className="bg-white/20 border-white/40">
                    {audio.genre}
                  </Badge>
                )}
                <Badge variant={audio.copyrightStatus === 'approved' ? 'default' : 'secondary'} className={
                  audio.copyrightStatus === 'approved' ? 'bg-green-600' :
                  audio.copyrightStatus === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                }>
                  {audio.copyrightStatus === 'approved' ? 'Copyright Registered' :
                   audio.copyrightStatus === 'pending' ? 'Pending Registration' : 'Registration Rejected'}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{audio.title}</h1>
              
              <div className="flex items-center mb-6">
                <User className="h-4 w-4 mr-2" />
                <span>By {audio.artistName}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm opacity-70">Duration</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDuration(audio.duration)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm opacity-70">Upload Date</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(audio.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm opacity-70">Play Count</span>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    <span>{audio.playCount} plays</span>
                  </div>
                </div>
              </div>
              
              {audio.description && (
                <p className="opacity-90 mb-6">{audio.description}</p>
              )}
              
              <div className="space-x-3">
                <Button className="bg-white text-brand-purple hover:bg-white/90">
                  Listen Now
                </Button>
                {audio.copyrightId && (
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    <FileCheck className="mr-2 h-4 w-4" />
                    View Copyright Details
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        {/* Audio Player */}
        <div className="mb-8">
          <AudioPlayer
            audioUrl={audio.audioUrl}
            title={audio.title}
            artist={audio.artistName}
            coverArt={audio.coverArt}
          />
        </div>
        
        <Tabs defaultValue="copyright" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="copyright">
              <Copyright className="h-4 w-4 mr-2" />
              Copyright Info
            </TabsTrigger>
            <TabsTrigger value="details">
              <List className="h-4 w-4 mr-2" />
              Audio Details
            </TabsTrigger>
            <TabsTrigger value="artist">
              <User className="h-4 w-4 mr-2" />
              Artist
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="copyright">
            {copyright ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-brand-purple" />
                    Copyright Information
                  </CardTitle>
                  <CardDescription>
                    Registration details for this audio work
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Number</h3>
                        <p className="font-medium">{copyright.registrationNumber}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Date</h3>
                        <p>{new Date(copyright.registrationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Current Copyright Owner</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-2 text-gray-400" />
                          <div>
                            <p className="font-medium">{copyright.ownerName}</p>
                            <p className="text-sm text-gray-500">
                              {copyright.status === 'transferred' ? 'Transferred from original artist' : 'Original artist'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {copyright.transfers.length > 0 && (
                      <>
                        <Separator />
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Ownership Transfer History</h3>
                          <div className="space-y-3">
                            {copyright.transfers.map((transfer) => (
                              <div key={transfer.id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium">
                                    {transfer.previousOwnerName} → {transfer.newOwnerName}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(transfer.transferDate).toLocaleDateString()}
                                  </span>
                                </div>
                                {transfer.description && (
                                  <p className="text-sm text-gray-600">{transfer.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Copyright Status</h3>
                      <div className="flex items-center">
                        <Badge className="bg-green-600">
                          {copyright.status === 'active' ? 'Active' : 
                           copyright.status === 'transferred' ? 'Transferred' : 
                           copyright.status === 'expired' ? 'Expired' : 'Pending'}
                        </Badge>
                        <span className="ml-2 text-sm text-gray-600">
                          Valid until {new Date(copyright.expirationDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Status</span>
                          <p className="font-medium">
                            {copyright.paymentStatus === 'paid' ? 'Paid' : 
                             copyright.paymentStatus === 'waived' ? 'Fee Waived' : 'Pending Payment'}
                          </p>
                        </div>
                        {copyright.paymentAmount && (
                          <div>
                            <span className="text-sm text-gray-600">Amount</span>
                            <p className="font-medium">TZS {copyright.paymentAmount.toLocaleString()}</p>
                          </div>
                        )}
                        {copyright.paymentDate && (
                          <div>
                            <span className="text-sm text-gray-600">Payment Date</span>
                            <p>{new Date(copyright.paymentDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Copyright Information</CardTitle>
                  <CardDescription>
                    No copyright registration found for this audio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-6 text-center">
                    <Copyright className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    
                    {audio.copyrightStatus === 'pending' ? (
                      <div>
                        <p className="text-gray-600 mb-3">This audio work has a pending copyright registration request.</p>
                        <Badge variant="secondary" className="bg-amber-500">Registration Pending</Badge>
                      </div>
                    ) : audio.copyrightStatus === 'rejected' ? (
                      <div>
                        <p className="text-gray-600 mb-3">The copyright registration for this audio was rejected.</p>
                        <Badge variant="destructive">Registration Rejected</Badge>
                      </div>
                    ) : (
                      <p className="text-gray-600">This audio work is not registered for copyright protection.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Audio Details</CardTitle>
                <CardDescription>
                  Technical and descriptive information about this audio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                      <p className="font-medium">{audio.title}</p>
                    </div>
                    
                    {audio.genre && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Genre</h3>
                        <p>{audio.genre}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                      <p>{formatDuration(audio.duration)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Upload Date</h3>
                      <p>{new Date(audio.uploadDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Play Count</h3>
                      <p>{audio.playCount} plays</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Audio URL</h3>
                      <a 
                        href={audio.audioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-brand-purple flex items-center hover:underline"
                      >
                        View source file <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
                
                {audio.description && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800">{audio.description}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="artist">
            <Card>
              <CardHeader>
                <CardTitle>About the Artist</CardTitle>
                <CardDescription>
                  Information about {audio.artistName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{audio.artistName}</h3>
                    <p className="text-sm text-gray-600">Verified Artist</p>
                  </div>
                </div>
                
                <Link to="/browse" className="block w-full">
                  <Button variant="outline" className="w-full">
                    View All Works by This Artist
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AudioDetail;
