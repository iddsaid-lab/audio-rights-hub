
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormItem, FormLabel, FormDescription } from '@/components/ui/form';

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
        <FormItem className="space-y-2">
          <FormLabel htmlFor="title">
            Audio Title <span className="text-red-500">*</span>
          </FormLabel>
          <Input
            id="title"
            value={audioData.title}
            onChange={(e) => updateAudioData({ title: e.target.value })}
            placeholder="e.g. African Sunset"
            required
          />
          <FormDescription>
            The official title of your audio work
          </FormDescription>
        </FormItem>
        
        <FormItem className="space-y-2">
          <FormLabel htmlFor="genre">Genre</FormLabel>
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
          <FormDescription>
            The musical genre or style of your audio
          </FormDescription>
        </FormItem>
        
        <FormItem className="space-y-2">
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            value={audioData.description}
            onChange={(e) => updateAudioData({ description: e.target.value })}
            placeholder="Describe your audio work..."
            className="min-h-[100px]"
          />
          <FormDescription>
            A brief description of your audio work, its inspiration, or meaning
          </FormDescription>
        </FormItem>
      </div>
    </div>
  );
};

export default AudioBasicInfo;
