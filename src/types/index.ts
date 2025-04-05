
export type UserRole = 'artist' | 'manager' | 'cashier' | 'officer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  verified: boolean;
  profileImage?: string;
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
}

export interface Copyright {
  id: string;
  audioId: string;
  registrationDate: string;
  expirationDate: string;
  ownerId: string;
  ownerName: string;
  status: 'pending' | 'active' | 'expired' | 'transferred';
  registrationNumber: string;
  paymentStatus: 'pending' | 'paid' | 'waived';
  paymentAmount?: number;
  paymentDate?: string;
  approvedBy?: string;
  transfers: CopyrightTransfer[];
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
  status: 'pending' | 'approved' | 'rejected';
  reviewerId?: string;
  reviewNotes?: string;
  reviewDate?: string;
  paymentStatus: 'pending' | 'paid' | 'waived';
  paymentAmount?: number;
  paymentDate?: string;
}
