
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Music, FileCheck, AlertCircle, Clock, Upload, Play, BarChart3 } from 'lucide-react';
import { mockAudios, mockCopyrights } from '@/data/mockData';

const ArtistDashboard = () => {
  const { user } = useAuth();
  
  // Filter data for the current user
  const userAudios = mockAudios.filter(audio => audio.artistId === user?.id);
  const userCopyrights = mockCopyrights.filter(copyright => copyright.ownerId === user?.id);
  
  const pendingAudios = userAudios.filter(audio => audio.copyrightStatus === 'pending');
  const approvedAudios = userAudios.filter(audio => audio.copyrightStatus === 'approved');
  
  // Calculate stats
  const totalPlays = userAudios.reduce((sum, audio) => sum + audio.playCount, 0);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Artist Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.fullName}</p>
        </div>
        <Link to="/artist/upload-audio">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload New Audio
          </Button>
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Uploads</p>
                <h3 className="text-3xl font-bold mt-2">{userAudios.length}</h3>
              </div>
              <div className="h-10 w-10 bg-brand-light-purple rounded-md flex items-center justify-center">
                <Music className="h-5 w-5 text-brand-purple" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Registered Copyrights</p>
                <h3 className="text-3xl font-bold mt-2">{approvedAudios.length}</h3>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <h3 className="text-3xl font-bold mt-2">{pendingAudios.length}</h3>
              </div>
              <div className="h-10 w-10 bg-amber-100 rounded-md flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Plays</p>
                <h3 className="text-3xl font-bold mt-2">{totalPlays}</h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Uploads */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Your most recently uploaded audio works</CardDescription>
        </CardHeader>
        <CardContent>
          {userAudios.length > 0 ? (
            <div className="divide-y">
              {userAudios.slice(0, 5).map((audio) => (
                <div key={audio.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                      <Music className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">{audio.title}</h4>
                      <p className="text-sm text-gray-500">Uploaded on {new Date(audio.uploadDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    {audio.copyrightStatus === 'approved' ? (
                      <Badge variant="default" className="bg-green-600">Approved</Badge>
                    ) : audio.copyrightStatus === 'pending' ? (
                      <Badge variant="secondary" className="bg-amber-500">Pending</Badge>
                    ) : (
                      <Badge variant="destructive">Rejected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">You haven't uploaded any audio works yet</p>
              <Link to="/artist/audios/upload" className="mt-4 inline-block">
                <Button variant="outline" size="sm">
                  Upload Your First Track
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tips & Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Tips & Guidelines</CardTitle>
          <CardDescription>Helpful information for managing your copyrights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex">
              <div className="mr-4 mt-1">
                <FileCheck className="h-5 w-5 text-brand-purple" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Copyright Registration Process</h4>
                <p className="text-sm text-gray-600">
                  After uploading your audio, submit a copyright registration request. COSOTA officials will review your submission,
                  verify ownership, and approve your copyright registration.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 mt-1">
                <BarChart3 className="h-5 w-5 text-brand-purple" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Track Your Performance</h4>
                <p className="text-sm text-gray-600">
                  Monitor play counts and engagement metrics for your audio works. This data can help you understand your audience and 
                  protect your rights more effectively.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 mt-1">
                <AlertCircle className="h-5 w-5 text-brand-purple" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Report Copyright Violations</h4>
                <p className="text-sm text-gray-600">
                  If you discover unauthorized use of your work, report it promptly through the platform for COSOTA to investigate
                  and take appropriate action.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistDashboard;
