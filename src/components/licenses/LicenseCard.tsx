
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Download, Calendar } from 'lucide-react';
import LicenseCertificateCard from './LicenseCertificateCard';

interface LicenseCardProps {
  license: {
    id: string;
    status: string;
    licenseType: string;
    audioId: string;
    issueDate: string;
    expirationDate: string;
    fee: number;
    restrictions?: string;
    ownerName: string;
    licenseeName: string;
    blockchainAddress?: string;
  };
  onViewCertificate: (license: any) => void;
  selectedLicense: any;
}

const LicenseCard: React.FC<LicenseCardProps> = ({ license, onViewCertificate, selectedLicense }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>License #{license.id.substring(0, 8)}</CardTitle>
            <CardDescription>
              Issued on {new Date(license.issueDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge className={
            license.status === 'active' 
              ? "bg-green-100 text-green-800 border-green-200" 
              : license.status === 'expired'
                ? "bg-amber-100 text-amber-800 border-amber-200"
                : "bg-red-100 text-red-800 border-red-200"
          }>
            {license.status === 'active' 
              ? 'Active' 
              : license.status === 'expired'
                ? 'Expired'
                : 'Revoked'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">License Type</h3>
              <p className="mt-1 capitalize">{license.licenseType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Audio ID</h3>
              <p className="mt-1">{license.audioId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Expiration Date</h3>
              <p className="mt-1">{new Date(license.expirationDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fee</h3>
              <p className="mt-1">TZS {license.fee.toLocaleString()}</p>
            </div>
          </div>
          
          {license.restrictions && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Restrictions</h3>
              <p className="mt-1 text-sm">{license.restrictions}</p>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onViewCertificate(license)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View License
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>License Certificate</DialogTitle>
                  <DialogDescription>
                    License #{license.id.substring(0, 8)} details
                  </DialogDescription>
                </DialogHeader>
                {selectedLicense && <LicenseCertificateCard license={selectedLicense} />}
                <div className="flex justify-end mt-4">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {license.status === 'active' && (
              <Button variant="outline" className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
                Renew
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LicenseCard;
