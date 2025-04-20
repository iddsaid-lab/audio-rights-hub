
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { mockAudios } from '@/data/mockData';
import { FileText, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const RequestLicense = () => {
  const { user } = useAuth();

  // State for audio select and search
  const [search, setSearch] = useState('');
  const [selectedAudioId, setSelectedAudioId] = useState<string | undefined>(undefined);

  // Filter audios that can be licensed (not owned by current user)
  const licensableAudios = mockAudios.filter(
    audio => audio.artistId !== user?.id && audio.allowLicensing
  );

  // Filter for search
  const filteredAudios = licensableAudios.filter(audio =>
    audio.title.toLowerCase().includes(search.toLowerCase()) ||
    audio.artistName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for handling the license request would go here
    alert('License request submitted!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Request License</h1>
          <p className="text-gray-600">Request a license to use audio content</p>
        </div>
        <Link to="/artist/licenses">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Licenses
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>License Request Form</CardTitle>
          <CardDescription>
            Fill out this form to request permission to use a copyrighted audio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="audio">Select Audio</Label>
                {/* Search bar for audio */}
                <div className="relative mt-2 mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="audio-search"
                    placeholder="Search by title or artist"
                    className="pl-10"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <Select value={selectedAudioId} onValueChange={setSelectedAudioId}>
                  <SelectTrigger id="audio">
                    <SelectValue placeholder="Select an audio file" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAudios.length === 0 ? (
                      <div className="p-2 text-gray-400 text-sm">No audio found</div>
                    ) : (
                      filteredAudios.map(audio => (
                        <SelectItem key={audio.id} value={audio.id}>
                          {audio.title} by {audio.artistName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="license-type">License Type</Label>
                <Select>
                  <SelectTrigger id="license-type">
                    <SelectValue placeholder="Choose license type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="non-commercial">Non-Commercial</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="intended-use">Intended Use</Label>
                <Textarea
                  id="intended-use"
                  placeholder="Describe how you plan to use this audio"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="duration">License Duration (months)</Label>
                <Input type="number" id="duration" min={1} max={36} defaultValue={12} />
              </div>

              <div>
                <Label>Proposed Fee (TZS)</Label>
                <div className="flex items-center space-x-2">
                  <Input type="number" id="fee" min={0} />
                  <span className="text-sm text-gray-500">(Optional)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="submit" className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" />
                Submit License Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestLicense;
