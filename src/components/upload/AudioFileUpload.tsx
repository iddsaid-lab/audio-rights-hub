
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Image, Upload, X } from 'lucide-react';

interface AudioFileUploadProps {
  audioData: any;
  updateAudioData: (data: any) => void;
}

const AudioFileUpload = ({ audioData, updateAudioData }: AudioFileUploadProps) => {
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAudioData({ audioFile: file });
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAudioData({ coverArt: file });
      setCoverArtPreview(URL.createObjectURL(file));
    }
  };

  const clearAudioFile = () => {
    updateAudioData({ audioFile: null });
    setAudioPreview(null);
  };

  const clearCoverArt = () => {
    updateAudioData({ coverArt: null });
    setCoverArtPreview(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
        <p className="text-gray-600 mb-6">
          Upload your audio file and cover art. The audio file will be used for copyright registration and hash generation.
        </p>
      </div>
      
      <div className="space-y-6">
        <FormItem>
          <FormLabel>
            Audio File <span className="text-red-500">*</span>
          </FormLabel>
          <Card className={`border-2 border-dashed p-6 ${audioPreview ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
            {!audioPreview ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Music className="h-12 w-12 text-gray-400 mb-4" />
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Drag and drop your audio file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: MP3, WAV, AAC, FLAC (Max 20MB)
                  </p>
                </div>
                <div>
                  <Label htmlFor="audio-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md">
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </div>
                    <Input
                      id="audio-upload"
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioChange}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-green-100 rounded-md flex items-center justify-center mr-4">
                    <Music className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{audioData.audioFile?.name}</p>
                    <p className="text-sm text-gray-500">
                      {(audioData.audioFile?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearAudioFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>
          <FormDescription>
            This audio file will be analyzed to generate a unique hash for copyright verification
          </FormDescription>
        </FormItem>
        
        <FormItem>
          <FormLabel>Cover Art (Optional)</FormLabel>
          <Card className={`border-2 border-dashed p-6 ${coverArtPreview ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}`}>
            {!coverArtPreview ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Image className="h-12 w-12 text-gray-400 mb-4" />
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Upload cover art for your audio
                  </p>
                  <p className="text-xs text-gray-500">
                    Recommended size: 1400x1400px (Max 5MB)
                  </p>
                </div>
                <div>
                  <Label htmlFor="cover-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md">
                      <Upload className="h-4 w-4 mr-2" />
                      Select Image
                    </div>
                    <Input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverArtChange}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-md overflow-hidden mr-4">
                    <img src={coverArtPreview} alt="Cover Art Preview" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{audioData.coverArt?.name}</p>
                    <p className="text-sm text-gray-500">
                      {(audioData.coverArt?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearCoverArt}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>
          <FormDescription>
            A visual representation of your audio work
          </FormDescription>
        </FormItem>
      </div>
    </div>
  );
};

export default AudioFileUpload;
