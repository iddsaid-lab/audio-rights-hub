
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Music, ArrowLeft, ArrowRight, FileCheck, Upload, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AudioBasicInfo from '@/components/upload/AudioBasicInfo';
import AudioFileUpload from '@/components/upload/AudioFileUpload';
import AudioAdditionalInfo from '@/components/upload/AudioAdditionalInfo';
import AudioCopyrightOptions from '@/components/upload/AudioCopyrightOptions';
import AudioUploadReview from '@/components/upload/AudioUploadReview';
import { useToast } from '@/hooks/use-toast';

const UploadAudio = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [audioData, setAudioData] = useState({
    title: '',
    genre: '',
    description: '',
    collaborators: [],
    recordingDate: '',
    audioFile: null,
    coverArt: null,
    isOriginalWork: true,
    hasReleased: false,
    releaseInfo: '',
    allowLicensing: false,
    licensingPrice: 0,
    requestType: 'new' as 'new' | 'renewal',
    previousCopyrightId: '',
    agreementChecked: false
  });

  const updateAudioData = (data: Partial<typeof audioData>) => {
    setAudioData({ ...audioData, ...data });
  };

  const steps = [
    { id: 1, name: 'Basic Info', component: AudioBasicInfo },
    { id: 2, name: 'Upload Audio', component: AudioFileUpload },
    { id: 3, name: 'Additional Info', component: AudioAdditionalInfo },
    { id: 4, name: 'Copyright Options', component: AudioCopyrightOptions },
    { id: 5, name: 'Review & Submit', component: AudioUploadReview }
  ];

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!audioData.title) {
        toast({
          title: "Required fields missing",
          description: "Please provide a title for your audio",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!audioData.audioFile) {
        toast({
          title: "Audio file required",
          description: "Please upload an audio file to continue",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep === 5) {
      if (!audioData.agreementChecked) {
        toast({
          title: "Agreement required",
          description: "Please confirm that you own the rights to this audio",
          variant: "destructive"
        });
        return;
      }
      
      // Submit form
      handleSubmit();
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // In a real app, this would make an API call to submit the data
    toast({
      title: "Audio submitted successfully",
      description: "Your audio has been uploaded and is pending copyright registration",
    });
    
    // Navigate back to audios page
    setTimeout(() => {
      navigate('/artist/audios');
    }, 1500);
  };

  const CurrentStepComponent = steps.find(step => step.id === currentStep)?.component || steps[0].component;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Upload New Audio</h1>
          <p className="text-gray-600">Register your work for copyright protection</p>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`flex items-center justify-center h-10 w-10 rounded-full border-2 ${
                  currentStep === step.id 
                    ? 'border-brand-purple bg-brand-purple text-white' 
                    : currentStep > step.id 
                      ? 'border-green-500 bg-green-500 text-white' 
                      : 'border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className={`mt-2 text-sm ${
                currentStep === step.id 
                  ? 'font-medium text-brand-purple' 
                  : 'text-gray-500'
              }`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
          <div 
            className="absolute top-0 left-0 h-1 bg-brand-purple transition-all" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs value={currentStep.toString()} className="w-full">
            {steps.map((step) => (
              <TabsContent key={step.id} value={step.id.toString()} className="mt-0">
                <CurrentStepComponent 
                  audioData={audioData} 
                  updateAudioData={updateAudioData} 
                />
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? () => navigate('/artist/audios') : handlePrevious}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <Button onClick={handleNext} className="flex items-center">
              {currentStep === steps.length ? (
                <>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Submit for Review
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadAudio;
