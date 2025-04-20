
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormItem } from '@/components/ui/form';
import { Music, Calendar, Tag, FileText, DollarSign, Info } from 'lucide-react';

interface AudioUploadReviewProps {
  audioData: any;
  updateAudioData: (data: any) => void;
}

const AudioUploadReview = ({ audioData, updateAudioData }: AudioUploadReviewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>
        <p className="text-gray-600 mb-6">
          Review your audio submission details before finalizing the copyright registration request.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <Music className="mr-2 h-5 w-5 text-brand-purple" />
                Audio Details
              </h3>
              <div className="mt-3 pl-7 space-y-2">
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Title:</span>
                  <span className="col-span-2 font-medium">{audioData.title || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Genre:</span>
                  <span className="col-span-2">{audioData.genre || 'Not specified'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Description:</span>
                  <span className="col-span-2">{audioData.description || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Audio File:</span>
                  <span className="col-span-2">{audioData.audioFile?.name || 'Not uploaded'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Cover Art:</span>
                  <span className="col-span-2">{audioData.coverArt?.name || 'Not uploaded'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <Info className="mr-2 h-5 w-5 text-brand-purple" />
                Additional Information
              </h3>
              <div className="mt-3 pl-7 space-y-2">
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Original Work:</span>
                  <span className="col-span-2">{audioData.isOriginalWork ? 'Yes' : 'No'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Recording Date:</span>
                  <span className="col-span-2">
                    {audioData.recordingDate ? new Date(audioData.recordingDate).toLocaleDateString() : 'Not specified'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Collaborators:</span>
                  <span className="col-span-2">
                    {audioData.collaborators.length > 0 
                      ? audioData.collaborators.join(', ') 
                      : 'None'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Previously Released:</span>
                  <span className="col-span-2">{audioData.hasReleased ? 'Yes' : 'No'}</span>
                </div>
                {audioData.hasReleased && (
                  <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                    <span className="text-gray-500">Release Info:</span>
                    <span className="col-span-2">{audioData.releaseInfo || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5 text-brand-purple" />
                Copyright Options
              </h3>
              <div className="mt-3 pl-7 space-y-2">
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Registration Type:</span>
                  <span className="col-span-2 capitalize">{audioData.requestType}</span>
                </div>
                {audioData.requestType === 'renewal' && (
                  <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                    <span className="text-gray-500">Previous Copyright:</span>
                    <span className="col-span-2">{audioData.previousCopyrightId || 'Not selected'}</span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                  <span className="text-gray-500">Allow Licensing:</span>
                  <span className="col-span-2">{audioData.allowLicensing ? 'Yes' : 'No'}</span>
                </div>
                {audioData.allowLicensing && (
                  <div className="grid grid-cols-3 gap-2 py-1 border-b border-gray-100">
                    <span className="text-gray-500">Licensing Price:</span>
                    <span className="col-span-2">
                      {audioData.licensingPrice > 0 
                        ? `${audioData.licensingPrice.toLocaleString()} TZS` 
                        : 'Not set'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="pt-4 border-t border-gray-200">
        <div className="bg-amber-50 p-4 rounded-md mb-4">
          <p className="text-amber-800 text-sm">
            <strong>Important:</strong> By submitting this form, you are initiating a copyright registration request. 
            After submission, a cashier will review your request and generate a payment number. 
            Once payment is confirmed, COSOTA officers will verify your audio and process your copyright registration.
          </p>
        </div>
        
        <FormItem className="flex items-start space-x-3 space-y-0">
          <Checkbox 
            id="agreement" 
            checked={audioData.agreementChecked}
            onCheckedChange={(checked) => 
              updateAudioData({ agreementChecked: checked === true })
            }
          />
          <div className="space-y-1 leading-none">
            <Label htmlFor="agreement" className="font-medium">
              Copyright Ownership Declaration
            </Label>
            <p className="text-sm text-gray-600">
              I hereby declare that I am the rightful owner of this audio work, or have the legal authority to submit 
              it for copyright registration. I understand that providing false information may result in the rejection 
              of my copyright claim and possible legal consequences.
            </p>
          </div>
        </FormItem>
      </div>
    </div>
  );
};

export default AudioUploadReview;
