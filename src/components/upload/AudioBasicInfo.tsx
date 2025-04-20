
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const genres = [
  'Afrobeat', 'Bongo Flava', 'Taarab', 'Gospel', 'Hip Hop', 
  'R&B', 'Jazz', 'Classical', 'Folk', 'Rock', 'Electronic', 'Other'
];

interface AudioBasicInfoProps {
  audioData: any;
  updateAudioData: (data: any) => void;
}

const AudioBasicInfo = ({ audioData, updateAudioData }: AudioBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
        <p className="text-gray-600 mb-6">
          Provide basic details about your audio work. This information will be used for copyright registration.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Audio Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={audioData.title}
            onChange={(e) => updateAudioData({ title: e.target.value })}
            placeholder="e.g. African Sunset"
            required
          />
          <p className="text-sm text-muted-foreground">
            The official title of your audio work
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Select
            value={audioData.genre}
            onValueChange={(value) => updateAudioData({ genre: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre.toLowerCase()}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            The musical genre or style of your audio
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={audioData.description}
            onChange={(e) => updateAudioData({ description: e.target.value })}
            placeholder="Describe your audio work..."
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            A brief description of your audio work, its inspiration, or meaning
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioBasicInfo;
