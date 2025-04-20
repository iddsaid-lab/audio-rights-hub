
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        <div className="space-y-3">
          <Label>Registration Type</Label>
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
          <p className="text-sm text-muted-foreground">
            Select whether this is a new copyright registration or renewal of an existing one
          </p>
        </div>
        
        {audioData.requestType === 'renewal' && (
          <div className="space-y-2">
            <Label htmlFor="previousCopyright">Previous Copyright</Label>
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
            <p className="text-sm text-muted-foreground">
              Select the copyright registration that you wish to renew
            </p>
          </div>
        )}
        
        <div className="space-y-6 pt-4 border-t border-gray-200">
          <div className="flex flex-row items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="allowLicensing">Allow Licensing</Label>
              <p className="text-sm text-muted-foreground">
                Make your work available for others to license and use
              </p>
            </div>
            <Switch
              id="allowLicensing"
              checked={audioData.allowLicensing}
              onCheckedChange={(checked) => updateAudioData({ 
                allowLicensing: checked,
                licensingPrice: !checked ? 0 : audioData.licensingPrice
              })}
            />
          </div>
          
          {audioData.allowLicensing && (
            <div className="space-y-2">
              <Label htmlFor="licensingPrice">Licensing Price (TZS)</Label>
              <Input
                id="licensingPrice"
                type="number"
                min="0"
                value={audioData.licensingPrice}
                onChange={(e) => updateAudioData({ licensingPrice: parseInt(e.target.value) || 0 })}
                placeholder="Enter amount in TZS"
              />
              <p className="text-sm text-muted-foreground">
                Set your preferred licensing fee for this audio work
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioCopyrightOptions;
