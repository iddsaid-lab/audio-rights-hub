
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const ArtistSettings = () => {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-gray-500 text-sm">Receive updates about your copyrights and licenses</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Copyright Approval</h3>
                <p className="text-gray-500 text-sm">Get notified when your copyright is approved or rejected</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Payment Receipts</h3>
                <p className="text-gray-500 text-sm">Receive email receipts for payments</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Preferences</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-gray-500 text-sm">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Profile Visibility</h3>
                <p className="text-gray-500 text-sm">Control who can see your profile</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-gray-500 text-sm">Update your password for added security</p>
              </div>
              <Button variant="outline">Change</Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistSettings;
