
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle, Music } from 'lucide-react';

const RegisterSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <Music className="h-12 w-12 text-brand-purple mx-auto" />
          </Link>
        </div>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Submitted Successfully
            </h2>
            
            <p className="text-gray-600 mb-4">
              Thank you for registering as an artist with AudioRightsHub. Your application has been submitted and is pending review by COSOTA officials.
            </p>
            
            <div className="bg-brand-light-purple p-4 rounded-lg text-left mb-4">
              <h3 className="font-medium mb-2">What happens next?</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Our verification team will review your application</li>
                <li>You may be contacted for additional information</li>
                <li>Once verified, you'll receive an email confirmation</li>
                <li>After verification, you can log in and start registering your audio works</li>
              </ol>
            </div>
            
            <p className="text-sm text-gray-500">
              Please check your email regularly for updates on your application status.
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Go to Login</Button>
            </Link>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterSuccess;
