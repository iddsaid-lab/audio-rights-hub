
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { mockCopyrights } from '@/data/mockData';

interface AudioCopyrightOptionsProps {
  audioData: any;
  updateAudioData: (data: any) => void;
}

const AudioCopyrightOptions = ({ audioData, updateAudioData }: AudioCopyrightOptionsProps) => {
  // Get existing copyrights for renewal selection
  const existingCopyrights = mockCopyrights;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Copyright Options</h2>
        <p className="text-gray-600 mb-6">
          Specify copyright details and licensing preferences for your audio work.
        </p>
      </div>
      
      <div className="space-y-6">
        <FormItem className="space-y-3">
          <FormLabel>Registration Type</FormLabel>
          <RadioGroup 
            value={audioData.requestType}
            onValueChange={(value) => updateAudioData({ requestType: value })}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="cursor-pointer">
                New Registration
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="renewal" id="renewal" />
              <Label htmlFor="renewal" className="cursor-pointer">
                Renewal of Existing Copyright
              </Label>
            </div>
          </RadioGroup>
          <FormDescription>
            Select whether this is a new copyright registration or renewal of an existing one
          </FormDescription>
        </FormItem>
        
        {audioData.requestType === 'renewal' && (
          <FormItem className="space-y-2">
            <FormLabel htmlFor="previousCopyright">Previous Copyright</FormLabel>
            <Select
              value={audioData.previousCopyrightId}
              onValueChange={(value) => updateAudioData({ previousCopyrightId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select existing copyright" />
              </SelectTrigger>
              <SelectContent>
                {existingCopyrights.map((copyright) => (
                  <SelectItem key={copyright.id} value={copyright.id}>
                    {copyright.registrationNumber} - Expires: {new Date(copyright.expirationDate).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the copyright registration that you wish to renew
            </FormDescription>
          </FormItem>
        )}
        
        <div className="space-y-6 pt-4 border-t border-gray-200">
          <FormItem className="flex flex-row items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <FormLabel htmlFor="allowLicensing">Allow Licensing</FormLabel>
              <FormDescription>
                Make your work available for others to license and use
              </FormDescription>
            </div>
            <Switch
              id="allowLicensing"
              checked={audioData.allowLicensing}
              onCheckedChange={(checked) => updateAudioData({ 
                allowLicensing: checked,
                licensingPrice: !checked ? 0 : audioData.licensingPrice
              })}
            />
          </FormItem>
          
          {audioData.allowLicensing && (
            <FormItem className="space-y-2">
              <FormLabel htmlFor="licensingPrice">Licensing Price (TZS)</FormLabel>
              <Input
                id="licensingPrice"
                type="number"
                min="0"
                value={audioData.licensingPrice}
                onChange={(e) => updateAudioData({ licensingPrice: parseInt(e.target.value) || 0 })}
                placeholder="Enter amount in TZS"
              />
              <FormDescription>
                Set your preferred licensing fee for this audio work
              </FormDescription>
            </FormItem>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioCopyrightOptions;
