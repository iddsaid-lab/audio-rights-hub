// Centralized API Service for audio-rights-hub
// Integrates: Auth, Copyright, Invoice, Payment, Notification, AI, Blockchain

const API_BASE = 'http://127.0.0.1:4000/api'; // Adjust if your backend runs on a different path or port

/**
 * Gets a new Ethereum wallet from backend.
 * Returns: { address, privateKey }
 */
export async function getNewWallet(token?: string) {
  token = ApiService.getToken(token);
  const res = await fetch(`${API_BASE}/blockchain/wallet/new`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to generate wallet');
  return await res.json();
}

export class ApiService {
  // --- AUTH ---
  static async register(data: {email: string, password: string, fullName: string, role: string}) {
    // Strong validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) throw new Error('Invalid email');
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d]).{8,}$/.test(data.password)) throw new Error('Password must be at least 8 chars, include upper, lower, number, symbol');
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Registration failed');
    return await res.json();
  }
  static async login(data: {email: string, password: string}) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
    return await res.json();
  }
  static async verifyUser(userId: number, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/admin/verify-artist/${userId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Verification failed');
    return await res.json();
  }

  // --- COPYRIGHTS ---
  static getToken(token?: string) {
    if (token) return token;
    const saved = localStorage.getItem('audioRightsUser');
    return saved ? JSON.parse(saved).token : '';
  }

  static async submitCopyright(data: any, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/copyrights/submit`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data // FormData for file upload
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Submit copyright failed');
    return await res.json();
  }
  static async getAllCopyrights(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/copyrights/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch copyrights');
    return await res.json();
  }

  static async getAllCopyrightsWithAudio(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/copyrights/with-audio`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch copyrights with audio');
    return await res.json();
  }

  static async getMyCopyrights(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/copyrights/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch your copyrights');
    return await res.json();
  }

  static async getMyAudios(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/audios/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch your audios');
    return await res.json();
  }
  static async getCopyrightById(id: number) {
    const res = await fetch(`${API_BASE}/copyrights/${id}`);
    if (!res.ok) throw new Error('Failed to fetch copyright');
    return await res.json();
  }

  static async approveCopyrightPayment(copyrightRequestId: number, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/copyrights/approve-payment/${copyrightRequestId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to approve copyright payment');
    return await res.json();
  }

  // Register copyright on blockchain via backend endpoint
  static async registerCopyrightOnBlockchain(payload: any, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/blockchain/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Blockchain registration failed');
    return await res.json();
  }

  // --- BLOCKCHAIN ---
  /**
   * Checks if a hash exists in the blockchain.
   * Backend should return: { exists: boolean }
   */
  static async checkHashExistsInBlockchain(hash: string, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(
      `${API_BASE}/blockchain/hash/${hash}/exists`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    if (!res.ok) throw new Error('Failed to check hash on blockchain');
    return await res.json(); // Should return { exists: boolean }
  }

  // --- INVOICES ---
  static async getAllInvoices(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/invoices/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return await res.json();
  }
  static async createInvoice(data: any, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/invoices/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Create invoice failed');
    return await res.json();
  }
  static async getInvoicesByArtist(artistId: number, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/invoices/artist/${artistId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return await res.json();
  }
  static async getInvoicesByArtistAndCopyright(artistId: number, copyrightRequestId: number, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/invoices/by-artist-and-copyright?artistId=${artistId}&copyrightRequestId=${copyrightRequestId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return await res.json();
  }
  static async payInvoice(invoiceId: number, data: any, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/invoices/${invoiceId}/pay`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Pay invoice failed');
    return await res.json();
  }

  // --- PAYMENTS ---
  static async getPayments(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/payments/all`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to fetch payments');
    return await res.json();
  }
  static async createPayment(data: any, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/payments/create`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Create payment failed');
    return await res.json();
  }
  static async approvePayment(paymentId: number, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Approve payment failed');
    return await res.json();
  }
  static async submitPaymentReference(paymentId: number, paymentReference: string, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/payments/${paymentId}/submit-reference`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ paymentReference })
    });
    if (!res.ok) throw new Error('Submit payment reference failed');
    return await res.json();
  }

  static async reviewPayment(paymentId: number, action: 'approve' | 'reject', token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/payments/${paymentId}/review`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ action })
    });
    if (!res.ok) throw new Error('Review payment failed');
    return await res.json();
  }

  // --- NOTIFICATIONS ---
  static async notifyUser(userId: number, message: string, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/notifications/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ userId, message })
    });
    if (!res.ok) throw new Error('Notification failed');
    return await res.json();
  }

  // --- AI SERVICES ---
  static async generateAudioHash(audioFileUrl: string, fileName: string, token?: string) {
    token = ApiService.getToken(token);
    // Fetch the audio file as a blob
    const response = await fetch(audioFileUrl);
    if (!response.ok) throw new Error('Failed to fetch audio file');
    const blob = await response.blob();
    // Create a File object with the correct name and type
    const file = new File([blob], fileName, { type: blob.type });
    const formData = new FormData();
    formData.append('audio', file);
    const res = await fetch('http://localhost:5000/verify', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (!res.ok) throw new Error('Failed to generate audio hash');
    return await res.json();
  }

  static async analyzeAudio(audioUrl: string, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ audioUrl })
    });
    if (!res.ok) throw new Error('AI analysis failed');
    return await res.json();
  }

  // --- BLOCKCHAIN (Mocked) ---
  static async pushToBlockchain(data: any, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/blockchain/push`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Blockchain push failed');
    return await res.json();
  }

  static async getAllAudios(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/audios/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch audios');
    return await res.json();
  }

  // Register official user via /api/admin/create-user
  static async createOfficialUser(data: { fullName: string; email: string; password: string; role: string }, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/admin/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to create official user');
    return await res.json();
  }

  static async getMyProfile(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/artists/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch your profile');
    return await res.json();
  }

  static async getAllVerificationRequests(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/admin/verifications/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch verification requests');
    return await res.json();
  }

  static async getAllArtistProfiles(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/artists/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch artist profiles');
    return await res.json();
  }
  static async escalateCopyrightRequest(id: number, escalationNote: string, token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/copyrights/escalate/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ escalationNote })
    });
    if (!res.ok) throw new Error('Failed to escalate request');
    return await res.json();
  }

  // Get all official users (managers, officers, cashiers)
  static async getAllOfficials(token?: string) {
    token = ApiService.getToken(token);
    const res = await fetch(`${API_BASE}/admin/officials`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch official users');
    return await res.json();
  }
}

export default ApiService;
