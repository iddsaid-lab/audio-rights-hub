
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const AdminSettings = () => {
  const { toast } = useToast();
  const { user } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="fees">Fee Structure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Automatic Notifications</h3>
                  <p className="text-gray-500 text-sm">Send automated notifications to artists</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Public Registration</h3>
                  <p className="text-gray-500 text-sm">Allow public registration without invitation</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Maintenance Mode</h3>
                  <p className="text-gray-500 text-sm">Temporarily disable the system for maintenance</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure system security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enforce Two-Factor Authentication</h3>
                  <p className="text-gray-500 text-sm">Require all admin users to use 2FA</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Session Timeout</h3>
                  <p className="text-gray-500 text-sm">Automatically log out inactive users</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Access Logs</h3>
                  <p className="text-gray-500 text-sm">View system access logs</p>
                </div>
                <Button variant="outline">View Logs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Copyright Fee Structure</CardTitle>
              <CardDescription>Configure registration and licensing fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Copyright Registration Fees</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Standard Registration</h4>
                    <div className="mt-1 flex items-center">
                      <span className="text-2xl font-bold">$50</span>
                      <Button variant="ghost" size="sm" className="ml-2">Edit</Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Expedited Registration</h4>
                    <div className="mt-1 flex items-center">
                      <span className="text-2xl font-bold">$75</span>
                      <Button variant="ghost" size="sm" className="ml-2">Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Licensing Fees</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Commercial License</h4>
                    <div className="mt-1 flex items-center">
                      <span className="text-2xl font-bold">$200</span>
                      <Button variant="ghost" size="sm" className="ml-2">Edit</Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Non-commercial License</h4>
                    <div className="mt-1 flex items-center">
                      <span className="text-2xl font-bold">$100</span>
                      <Button variant="ghost" size="sm" className="ml-2">Edit</Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Educational License</h4>
                    <div className="mt-1 flex items-center">
                      <span className="text-2xl font-bold">$50</span>
                      <Button variant="ghost" size="sm" className="ml-2">Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSave}>Save All Changes</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
