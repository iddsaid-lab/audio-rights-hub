import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockArtistProfiles } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Copy } from 'lucide-react';

const ArtistProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Find artist profile data
  const artistProfile = mockArtistProfiles.find(profile => profile.userId === user?.id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: artistProfile?.fullName || user?.fullName || '',
    dateOfBirth: artistProfile?.dateOfBirth || '',
    address: artistProfile?.address || '',
    phoneNumber: artistProfile?.phoneNumber || '',
    nationalIdNumber: artistProfile?.nationalIdNumber || '',
    passportNumber: artistProfile?.passportNumber || '',
    previousWorkUrl: artistProfile?.previousWorkUrl || '',
  });

  // Sample blockchain wallet address for demo
  const walletAddress = artistProfile?.walletAddress || "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Would save to backend in real application
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    
    setIsEditing(false);
  };

  const getVerificationStatusBadge = () => {
    if (!artistProfile) return null;
    
    switch (artistProfile.verificationStatus) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending Verification</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Artist Profile</h1>
          <p className="text-gray-600">Manage your artist information</p>
        </div>
        {artistProfile?.verificationStatus === 'verified' ? (
          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">Verified Artist</Badge>
        ) : (
          getVerificationStatusBadge()
        )}
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="verification">Verification Status</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                This information will be used for verification and copyright registration.
              </CardDescription>
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline"
                  className="absolute top-4 right-4"
                >
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                      <Input 
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</label>
                      <Input 
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
                      <Input 
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="nationalIdNumber" className="text-sm font-medium">National ID Number</label>
                      <Input 
                        id="nationalIdNumber"
                        name="nationalIdNumber"
                        value={formData.nationalIdNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="passportNumber" className="text-sm font-medium">Passport Number (Optional)</label>
                      <Input 
                        id="passportNumber"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="previousWorkUrl" className="text-sm font-medium">Link to Previous Work (Optional)</label>
                      <Input 
                        id="previousWorkUrl"
                        name="previousWorkUrl"
                        value={formData.previousWorkUrl}
                        onChange={handleChange}
                        placeholder="https://"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">Address</label>
                    <Textarea 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1">{artistProfile?.fullName || user?.fullName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                    <p className="mt-1">{artistProfile?.dateOfBirth || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                    <p className="mt-1">{artistProfile?.phoneNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">National ID Number</h3>
                    <p className="mt-1">{artistProfile?.nationalIdNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Passport Number</h3>
                    <p className="mt-1">{artistProfile?.passportNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Link to Previous Work</h3>
                    <p className="mt-1">
                      {artistProfile?.previousWorkUrl ? (
                        <a href={artistProfile.previousWorkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Work
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1">{artistProfile?.address || 'Not specified'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                Your artist verification status and details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Current Status</h3>
                    <p className="text-gray-600 mt-1">
                      {artistProfile?.verificationStatus === 'verified' 
                        ? 'Your artist profile has been verified' 
                        : artistProfile?.verificationStatus === 'rejected'
                          ? 'Your verification was rejected'
                          : 'Your verification is pending review'}
                    </p>
                  </div>
                  {getVerificationStatusBadge()}
                </div>
                
                {artistProfile?.verificationStatus === 'rejected' && artistProfile?.verificationNotes && (
                  <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <h3 className="font-medium text-red-800">Rejection Reason</h3>
                    <p className="mt-1 text-red-700">{artistProfile.verificationNotes}</p>
                    <Button className="mt-4" variant="outline">
                      Resubmit for Verification
                    </Button>
                  </div>
                )}
                
                {artistProfile?.verificationStatus === 'verified' && (
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800">Verified Details</h3>
                    <div className="mt-2 space-y-2 text-green-700">
                      <p>Verified by: {artistProfile.verifiedBy || 'COSOTA Officer'}</p>
                      <p>Verified on: {artistProfile.verifiedAt ? new Date(artistProfile.verifiedAt).toLocaleDateString() : 'Not Available'}</p>
                    </div>
                  </div>
                )}
                
                {artistProfile?.verificationStatus === 'pending' && (
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                    <h3 className="font-medium text-amber-800">Verification in Progress</h3>
                    <p className="mt-1 text-amber-700">
                      Your verification is currently being reviewed by COSOTA officials. This process typically takes 2-5 business days.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Wallet</CardTitle>
              <CardDescription>
                Your blockchain wallet is used to track your copyrights and royalties on the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {artistProfile?.verificationStatus === 'verified' ? (
                  <>
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wallet className="h-5 w-5 text-green-700" />
                        <h3 className="font-medium text-green-800">Your Wallet Address</h3>
                      </div>

                      <div className="flex items-center">
                        <p className="text-green-700 font-mono break-all flex-1">
                          {walletAddress}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(walletAddress)}
                          className="ml-2"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">What is this wallet used for?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Copyright Tracking</h4>
                          <p className="text-sm text-gray-600">
                            Your copyrights are tracked on the blockchain using this wallet address. This creates a permanent and verifiable record of your work.
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Royalty Tracking</h4>
                          <p className="text-sm text-gray-600">
                            Any royalties generated from your work will be tracked using this wallet address. This ensures transparent and accurate royalty payments.
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Ownership Verification</h4>
                          <p className="text-sm text-gray-600">
                            Your ownership of copyrighted work is verifiable through this wallet address. This can be used to prove your ownership in case of disputes.
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Licensing Management</h4>
                          <p className="text-sm text-gray-600">
                            Any licenses issued for your work will be recorded on the blockchain and associated with this wallet address.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 border border-blue-100 rounded-lg">
                      <h3 className="font-medium text-blue-800 mb-2">Important Note</h3>
                      <p className="text-sm text-blue-700">
                        This wallet address was generated for you by COSOTA during the verification process. You do not need to manage private keys or passwords for this wallet. All blockchain interactions are handled by COSOTA on your behalf.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-10 text-center">
                    <Wallet className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Verification Required</h3>
                    <p className="text-gray-600 max-w-md">
                      You need to complete the artist verification process before a blockchain wallet can be generated for you. This wallet will be used to track your copyrights and royalties.
                    </p>
                    <Button className="mt-4" onClick={() => document.querySelector('[data-value="verification"]')?.dispatchEvent(new Event('click'))}>
                      Go to Verification
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistProfile;
