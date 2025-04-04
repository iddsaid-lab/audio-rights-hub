
import { 
  User, 
  ArtistProfile, 
  Audio, 
  Copyright, 
  CopyrightTransfer,
  License,
  ArtistVerificationRequest,
  CopyrightRequest
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'artist1@example.com',
    fullName: 'John Makonde',
    role: 'artist',
    verified: true,
    profileImage: '/placeholder.svg'
  },
  {
    id: 'user2',
    email: 'artist2@example.com',
    fullName: 'Maria Zawadi',
    role: 'artist',
    verified: false,
    profileImage: '/placeholder.svg'
  },
  {
    id: 'user3',
    email: 'manager@cosota.org',
    fullName: 'Emmanuel Mabondo',
    role: 'manager',
    verified: true,
    profileImage: '/placeholder.svg'
  },
  {
    id: 'user4',
    email: 'officer@cosota.org',
    fullName: 'Grace Nyerere',
    role: 'officer',
    verified: true,
    profileImage: '/placeholder.svg'
  },
  {
    id: 'user5',
    email: 'cashier@cosota.org',
    fullName: 'Baraka Mushi',
    role: 'cashier',
    verified: true,
    profileImage: '/placeholder.svg'
  }
];

// Mock Artist Profiles
export const mockArtistProfiles: ArtistProfile[] = [
  {
    userId: 'user1',
    fullName: 'John Makonde',
    dateOfBirth: '1985-05-15',
    address: '123 Banda Street, Dar es Salaam',
    phoneNumber: '+255 123 456 789',
    nationalIdNumber: 'TZ19850515123456',
    passportNumber: 'TB12345678',
    previousWorkUrl: 'https://example.com/portfolio/john-makonde',
    verificationStatus: 'verified',
    verificationNotes: 'All documents verified and approved.',
    verifiedBy: 'user3',
    verifiedAt: '2023-01-15T10:30:00Z'
  },
  {
    userId: 'user2',
    fullName: 'Maria Zawadi',
    dateOfBirth: '1992-08-22',
    address: '456 Uhuru Street, Arusha',
    phoneNumber: '+255 987 654 321',
    nationalIdNumber: 'TZ19920822654321',
    previousWorkUrl: 'https://example.com/portfolio/maria-zawadi',
    verificationStatus: 'pending',
    verificationNotes: 'Waiting for additional proof of previous work'
  }
];

// Mock Audio Tracks
export const mockAudios: Audio[] = [
  {
    id: 'audio1',
    title: 'African Sunset',
    artistId: 'user1',
    artistName: 'John Makonde',
    audioUrl: 'https://example.com/audio/african-sunset.mp3',
    coverArt: '/placeholder.svg',
    description: 'A relaxing melody inspired by Tanzanian sunsets',
    uploadDate: '2023-02-10T14:23:00Z',
    duration: 245, // in seconds
    genre: 'Afrofusion',
    copyrightStatus: 'approved',
    copyrightId: 'copyright1',
    playCount: 1250
  },
  {
    id: 'audio2',
    title: 'Dar City Lights',
    artistId: 'user1',
    artistName: 'John Makonde',
    audioUrl: 'https://example.com/audio/dar-city-lights.mp3',
    coverArt: '/placeholder.svg',
    description: 'Urban beats inspired by nightlife in Dar es Salaam',
    uploadDate: '2023-04-15T09:45:00Z',
    duration: 198, // in seconds
    genre: 'Bongo Flava',
    copyrightStatus: 'approved',
    copyrightId: 'copyright2',
    playCount: 3420
  },
  {
    id: 'audio3',
    title: 'Serengeti Dreams',
    artistId: 'user2',
    artistName: 'Maria Zawadi',
    audioUrl: 'https://example.com/audio/serengeti-dreams.mp3',
    coverArt: '/placeholder.svg',
    description: 'A journey through the sounds of the Serengeti plains',
    uploadDate: '2023-05-22T16:10:00Z',
    duration: 315, // in seconds
    genre: 'World',
    copyrightStatus: 'pending',
    playCount: 782
  },
  {
    id: 'audio4',
    title: 'Zanzibar Spice',
    artistId: 'user2',
    artistName: 'Maria Zawadi',
    audioUrl: 'https://example.com/audio/zanzibar-spice.mp3',
    coverArt: '/placeholder.svg',
    description: 'Rhythms inspired by the spice markets of Zanzibar',
    uploadDate: '2023-06-30T11:20:00Z',
    duration: 274, // in seconds
    genre: 'Taarab Fusion',
    copyrightStatus: 'pending',
    playCount: 521
  }
];

// Mock Copyrights
export const mockCopyrights: Copyright[] = [
  {
    id: 'copyright1',
    audioId: 'audio1',
    registrationDate: '2023-02-20T10:15:00Z',
    expirationDate: '2073-02-20T10:15:00Z',
    ownerId: 'user1',
    ownerName: 'John Makonde',
    status: 'active',
    registrationNumber: 'COSOTA-23-0245',
    paymentStatus: 'paid',
    paymentAmount: 25000, // TZS
    paymentDate: '2023-02-18T14:30:00Z',
    approvedBy: 'user3',
    transfers: []
  },
  {
    id: 'copyright2',
    audioId: 'audio2',
    registrationDate: '2023-04-25T09:30:00Z',
    expirationDate: '2073-04-25T09:30:00Z',
    ownerId: 'user1',
    ownerName: 'John Makonde',
    status: 'transferred',
    registrationNumber: 'COSOTA-23-0387',
    paymentStatus: 'paid',
    paymentAmount: 25000, // TZS
    paymentDate: '2023-04-22T15:45:00Z',
    approvedBy: 'user3',
    transfers: [
      {
        id: 'transfer1',
        copyrightId: 'copyright2',
        previousOwnerId: 'user1',
        previousOwnerName: 'John Makonde',
        newOwnerId: 'user6',
        newOwnerName: 'Tanzania Music Productions Ltd',
        transferDate: '2023-06-15T13:20:00Z',
        description: 'Full rights transfer as part of publishing deal',
        verifiedBy: 'user3'
      }
    ]
  }
];

// Mock Licenses
export const mockLicenses: License[] = [
  {
    id: 'license1',
    copyrightId: 'copyright1',
    audioId: 'audio1',
    licenseeId: 'user7',
    licenseeName: 'TZ Broadcasting Company',
    issueDate: '2023-03-10T14:00:00Z',
    expirationDate: '2024-03-10T14:00:00Z',
    licenseType: 'commercial',
    restrictions: 'Broadcasting rights only, no reproduction or distribution allowed',
    fee: 150000, // TZS
    paymentStatus: 'paid',
    status: 'active'
  }
];

// Mock Artist Verification Requests
export const mockVerificationRequests: ArtistVerificationRequest[] = [
  {
    artistId: 'user2',
    artistName: 'Maria Zawadi',
    submissionDate: '2023-05-05T09:15:00Z',
    status: 'pending',
    documents: {
      nationalId: 'https://example.com/documents/maria-id.pdf',
      previousWork: 'https://example.com/portfolio/maria-zawadi'
    }
  }
];

// Mock Copyright Requests
export const mockCopyrightRequests: CopyrightRequest[] = [
  {
    id: 'request1',
    audioId: 'audio3',
    artistId: 'user2',
    submissionDate: '2023-05-25T10:30:00Z',
    status: 'pending',
    paymentStatus: 'pending',
    paymentAmount: 25000 // TZS
  },
  {
    id: 'request2',
    audioId: 'audio4',
    artistId: 'user2',
    submissionDate: '2023-07-02T15:45:00Z',
    status: 'pending',
    paymentStatus: 'pending',
    paymentAmount: 25000 // TZS
  }
];

// Mock login function
export const mockLogin = (email: string, password: string): User | null => {
  const user = mockUsers.find(user => user.email === email);
  // In a real app, we would check password here
  return user || null;
};

// Helper function to format duration
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
