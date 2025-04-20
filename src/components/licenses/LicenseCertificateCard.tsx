
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Copyright, ShieldCheck, User, Calendar, Gavel } from "lucide-react";

interface LicenseCertificateCardProps {
  license: {
    licenseId: string;
    licenseType: "commercial" | "non-commercial" | "educational";
    licenseeName: string;
    ownerName: string;
    issueDate: string;
    expirationDate: string;
    audioId: string;
    restrictions?: string;
    fee: number;
    blockchainAddress?: string;
  };
}

const LicenseCertificateCard: React.FC<LicenseCertificateCardProps> = ({ license }) => {
  return (
    <Card className="max-w-lg mx-auto border-2 border-gray-300 shadow-lg bg-white print:border print:shadow-none">
      <CardContent className="p-8">
        <div className="flex items-center justify-center mb-6">
          <Copyright className="h-10 w-10 text-brand-purple mr-3" />
          <h1 className="text-2xl font-bold tracking-widest uppercase text-brand-purple">
            License Certificate
          </h1>
        </div>
        <div className="mb-2 flex justify-between items-center">
          <span className="flex items-center gap-2 text-gray-600 text-xs">
            <FileText className="h-4 w-4" />
            License ID
          </span>
          <span className="font-semibold tracking-wider">{license.licenseId.slice(0, 10).toUpperCase()}</span>
        </div>
        <div className="mb-6 flex items-center space-x-2">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-900 font-semibold capitalize">{license.licenseType} License</span>
        </div>
        <dl className="divide-y divide-gray-200 text-[15px]">
          <div className="py-2 flex justify-between">
            <dt className="flex gap-2 items-center text-gray-700"><User className="w-4 h-4" /> Licensee</dt>
            <dd className="font-medium">{license.licenseeName}</dd>
          </div>
          <div className="py-2 flex justify-between">
            <dt className="flex gap-2 items-center text-gray-700"><User className="w-4 h-4" /> Owner</dt>
            <dd className="font-medium">{license.ownerName}</dd>
          </div>
          <div className="py-2 flex justify-between">
            <dt className="flex gap-2 items-center text-gray-700"><FileText className="w-4 h-4" /> Audio ID</dt>
            <dd className="font-mono">{license.audioId}</dd>
          </div>
          <div className="py-2 flex justify-between">
            <dt className="flex gap-2 items-center text-gray-700"><Calendar className="w-4 h-4" /> Issue Date</dt>
            <dd>{new Date(license.issueDate).toLocaleDateString()}</dd>
          </div>
          <div className="py-2 flex justify-between">
            <dt className="flex gap-2 items-center text-gray-700"><Calendar className="w-4 h-4" /> Expiry Date</dt>
            <dd>{new Date(license.expirationDate).toLocaleDateString()}</dd>
          </div>
          <div className="py-2 flex justify-between">
            <dt className="flex gap-2 items-center text-gray-700"><Gavel className="w-4 h-4" /> Fee (TZS)</dt>
            <dd>{license.fee ? license.fee.toLocaleString() : "N/A"}</dd>
          </div>
          {license.restrictions && (
            <div className="py-2 flex flex-col">
              <dt className="flex gap-2 items-center text-gray-700"><ShieldCheck className="w-4 h-4" /> Restrictions</dt>
              <dd className="font-mono text-xs text-amber-700">{license.restrictions}</dd>
            </div>
          )}
          {license.blockchainAddress && (
            <div className="py-2 flex flex-col">
              <dt className="flex gap-2 items-center text-gray-700"><ShieldCheck className="w-4 h-4" /> Blockchain Address</dt>
              <dd className="font-mono text-xs text-brand-purple break-all">{license.blockchainAddress}</dd>
            </div>
          )}
        </dl>
        <div className="mt-8 border-t pt-3 text-xs text-gray-500 text-center">
          <p>
            This certificate confirms the licensing agreement between the copyright owner and licensee
            for the specified audio work. Use of this audio beyond the permitted terms is strictly prohibited.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LicenseCertificateCard;

