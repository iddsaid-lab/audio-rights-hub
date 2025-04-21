
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { mockLicenses } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Clock } from 'lucide-react';
import LicenseCard from '@/components/licenses/LicenseCard';
import { Link } from 'react-router-dom';
import { License } from '@/types';

const ArtistLicenses = () => {
  const { user } = useAuth();
  const [selectedLicense, setSelectedLicense] = useState(null);
  
  // Get licenses for this artist
  const artistLicenses = mockLicenses.filter(license => license.licenseeId === user?.id);
  
  const activeLicenses = artistLicenses.filter(license => license.status === 'active');
  const expiredLicenses = artistLicenses.filter(license => license.status === 'expired');
  const revokedLicenses = artistLicenses.filter(license => license.status === 'revoked');
  
  // Convert license data to certificate format
  const prepareLicenseCertificateData = (license: License) => {
    // Get the owner name from the license or use a default value
    return {
      licenseId: license.id,
      licenseType: license.licenseType,
      licenseeName: license.licenseeName,
      ownerName: "Copyright Owner", // Add a default owner name
      issueDate: license.issueDate,
      expirationDate: license.expirationDate,
      audioId: license.audioId,
      restrictions: license.restrictions,
      fee: license.fee,
      blockchainAddress: license.blockchainAddress
    };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Licenses</h1>
          <p className="text-gray-600">Manage your music licenses</p>
        </div>
        <Link to="/artist/request-license">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Request New License
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Licenses ({artistLicenses.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeLicenses.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredLicenses.length})</TabsTrigger>
          <TabsTrigger value="revoked">Revoked ({revokedLicenses.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artistLicenses.length > 0 ? (
              artistLicenses.map(license => (
                <LicenseCard
                  key={license.id}
                  license={{...license, ownerName: "Copyright Owner"}}
                  onViewCertificate={(license) => setSelectedLicense(prepareLicenseCertificateData(license))}
                  selectedLicense={selectedLicense}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No licenses yet</h3>
                <p className="mt-1 text-gray-500">Request a license to use other artists' work</p>
                <Link to="/artist/request-license">
                  <Button className="mt-4">
                    <FileText className="mr-2 h-4 w-4" />
                    Request License
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeLicenses.length > 0 ? (
              activeLicenses.map(license => (
                <LicenseCard
                  key={license.id}
                  license={{...license, ownerName: "Copyright Owner"}}
                  onViewCertificate={(license) => setSelectedLicense(prepareLicenseCertificateData(license))}
                  selectedLicense={selectedLicense}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No active licenses</h3>
                <p className="mt-1 text-gray-500">You don't have any active licenses</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="expired">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expiredLicenses.length > 0 ? (
              expiredLicenses.map(license => (
                <LicenseCard
                  key={license.id}
                  license={{...license, ownerName: "Copyright Owner"}}
                  onViewCertificate={(license) => setSelectedLicense(prepareLicenseCertificateData(license))}
                  selectedLicense={selectedLicense}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No expired licenses</h3>
                <p className="mt-1 text-gray-500">You don't have any expired licenses</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="revoked">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {revokedLicenses.length > 0 ? (
              revokedLicenses.map(license => (
                <LicenseCard
                  key={license.id}
                  license={{...license, ownerName: "Copyright Owner"}}
                  onViewCertificate={(license) => setSelectedLicense(prepareLicenseCertificateData(license))}
                  selectedLicense={selectedLicense}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No revoked licenses</h3>
                <p className="mt-1 text-gray-500">You don't have any revoked licenses</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistLicenses;
