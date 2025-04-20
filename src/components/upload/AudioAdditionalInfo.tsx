
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface AudioAdditionalInfoProps {
  audioData: any;
  updateAudioData: (data: any) => void;
}

const AudioAdditionalInfo = ({ audioData, updateAudioData }: AudioAdditionalInfoProps) => {
  const [date, setDate] = React.useState<Date | undefined>(audioData.recordingDate ? new Date(audioData.recordingDate) : undefined);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateAudioData({ recordingDate: selectedDate.toISOString() });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
        <p className="text-gray-600 mb-6">
          Provide more details about your audio work to strengthen your copyright claim.
        </p>
      </div>
      
      <div className="space-y-4">
        <FormItem className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="isOriginalWork" 
              checked={audioData.isOriginalWork}
              onCheckedChange={(checked) => 
                updateAudioData({ isOriginalWork: checked === true })
              }
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="isOriginalWork">
                This is my original work
              </Label>
              <p className="text-sm text-gray-500">
                I confirm that this is my original creation and not derived from another copyrighted work
              </p>
            </div>
          </div>
        </FormItem>
        
        <FormItem className="space-y-2">
          <FormLabel>Recording Date (if known)</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            The date when this audio work was recorded or created
          </FormDescription>
        </FormItem>
        
        <FormItem className="space-y-2">
          <FormLabel htmlFor="collaborators">Collaborators (if any)</FormLabel>
          <Textarea
            id="collaborators"
            placeholder="List any co-creators, musicians, producers, etc."
            value={audioData.collaborators.join(', ')}
            onChange={(e) => updateAudioData({ 
              collaborators: e.target.value.split(',').map((item: string) => item.trim()).filter(Boolean) 
            })}
            className="min-h-[80px]"
          />
          <FormDescription>
            List anyone who contributed to the creation of this work
          </FormDescription>
        </FormItem>
        
        <FormItem className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="hasReleased" 
              checked={audioData.hasReleased}
              onCheckedChange={(checked) => 
                updateAudioData({ hasReleased: checked === true })
              }
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="hasReleased">
                This work has been previously released
              </Label>
              <p className="text-sm text-gray-500">
                The audio has been publicly released or distributed before
              </p>
            </div>
          </div>
        </FormItem>
        
        {audioData.hasReleased && (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="releaseInfo">Release Information</FormLabel>
            <Textarea
              id="releaseInfo"
              placeholder="Provide details about the previous release..."
              value={audioData.releaseInfo}
              onChange={(e) => updateAudioData({ releaseInfo: e.target.value })}
              className="min-h-[80px]"
            />
            <FormDescription>
              Include release date, platform, and any other relevant details
            </FormDescription>
          </FormItem>
        )}
      </div>
    </div>
  );
};

export default AudioAdditionalInfo;
