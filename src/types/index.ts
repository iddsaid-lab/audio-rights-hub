
export type UserRole = 'artist' | 'manager' | 'cashier' | 'officer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  verified: boolean;
  profileImage?: string;
  walletAddress?: string;
}

export interface ArtistProfile {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  nationalIdNumber: string;
  passportNumber?: string;
  previousWorkUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  walletAddress?: string;
}

export interface Audio {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  audioUrl: string;
  coverArt?: string;
  description?: string;
  uploadDate: string;
  duration: number;
  genre?: string;
  copyrightStatus: 'pending' | 'approved' | 'rejected';
  copyrightId?: string;
  playCount: number;
  blockchainAddress?: string;
  audioHash?: string;
  allowLicensing?: boolean;
  licensingPrice?: number;
}

export interface Copyright {
  id: string;
  audioId: string;
  registrationDate: string;
  expirationDate: string;
  ownerId: string;
  ownerName: string;
  status: 'pending' | 'active' | 'expired' | 'transferred';
  registrationType: 'new' | 'renewal';
  previousCopyrightId?: string; // For renewals
  registrationNumber: string;
  paymentStatus: 'pending' | 'paid' | 'waived';
  paymentAmount?: number;
  paymentDate?: string;
  approvedBy?: string;
  transfers: CopyrightTransfer[];
  blockchainAddress?: string;
}

export interface CopyrightTransfer {
  id: string;
  copyrightId: string;
  previousOwnerId: string;
  previousOwnerName: string;
  newOwnerId: string;
  newOwnerName: string;
  transferDate: string;
  description?: string;
  verifiedBy?: string;
}

export interface License {
  id: string;
  copyrightId: string;
  audioId: string;
  licenseeId: string;
  licenseeName: string;
  issueDate: string;
  expirationDate: string;
  licenseType: 'commercial' | 'non-commercial' | 'educational';
  restrictions?: string;
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'waived';
  status: 'active' | 'expired' | 'revoked';
  blockchainAddress?: string; // For on-chain license records
  approvedBy?: string[];
  processingHistory?: ProcessingHistory[];
}

export interface ArtistVerificationRequest {
  artistId: string;
  artistName: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerId?: string;
  reviewNotes?: string;
  reviewDate?: string;
  documents: {
    nationalId: string;
    passport?: string;
    previousWork?: string;
  };
}

export interface CopyrightRequest {
  id: string;
  audioId: string;
  artistId: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  requestType: 'new' | 'renewal';
  previousCopyrightId?: string; // For renewals
  reviewerId?: string;
  reviewNotes?: string;
  reviewDate?: string;
  paymentStatus: 'pending' | 'paid' | 'waived';
  paymentAmount?: number;
  paymentDate?: string;
  blockchainAddress?: string;
  audioHash?: string;
  hashMatchFound?: boolean;
  escalatedToManager?: boolean;
  escalationReason?: string;
  escalationDate?: string;
  processingHistory?: ProcessingHistory[];
  similarAudios?: {
    id: string;
    title: string;
    artistName: string;
    ownerName: string;
    similarityScore: number;
  }[];
}

export interface LicenseRequest {
  id: string;
  copyrightId: string;
  audioId: string;
  requesterId: string;
  requesterName: string;
  ownerId: string;
  ownerName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  licenseType: 'commercial' | 'non-commercial' | 'educational';
  intendedUse: string;
  proposedFee?: number;
  paymentStatus?: 'pending' | 'paid' | 'waived';
  paymentDate?: string;
  processingHistory?: ProcessingHistory[];
}

export interface ProcessingHistory {
  userId: string;
  userRole: UserRole;
  userName: string;
  action: 'review' | 'payment' | 'hash_generation' | 'blockchain_verification' | 'escalation' | 'approval' | 'rejection' | 'certificate_generation';
  timestamp: string;
  notes?: string;
}

export interface CopyrightCertificate {
  id: string;
  copyrightId: string;
  audioId: string;
  artistId: string;
  issueDate: string;
  expirationDate: string;
  registrationNumber: string;
  blockchainAddress: string;
  certificateUrl?: string;
  renewalEligibleFrom?: string;
}

export interface LicenseCertificate {
  id: string;
  licenseId: string;
  copyrightId: string;
  audioId: string;
  licenseeId: string;
  ownerId: string;
  issueDate: string;
  expirationDate: string;
  licenseType: 'commercial' | 'non-commercial' | 'educational';
  restrictions: string[];
  fee: number;
  blockchainAddress: string;
  certificateUrl?: string;
}

export interface AudioAnalysisJob {
  id: string;
  audioId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  hash?: string;
  features?: {
    tempo?: number;
    key?: string;
    energy?: number;
    [key: string]: any;
  };
  error?: string;
}

export interface BlockchainTransaction {
  id: string;
  transactionType: 'copyright_registration' | 'license_issuance' | 'ownership_transfer' | 'wallet_creation';
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
  blockNumber?: number;
  timestamp: string;
  from: string;
  to: string;
  data: any;
  gas?: number;
  gasPrice?: number;
}
