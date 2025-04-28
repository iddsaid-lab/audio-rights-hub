import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ApiService from '../../services/ApiService';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BadgeDollarSign, Banknote, AlertCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ArtistPayments = () => {
  const { user } = useAuth();
  
  // Fetch payment records for the current artist from backend
  const [artistPayments, setArtistPayments] = useState<any[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    ApiService.getPayments().then((data) => {
      setArtistPayments(data.filter((req: any) => req.artistId === user?.id));
    });
  }, [user?.id]);

  // --- Add state for invoices ---
  const [artistInvoices, setArtistInvoices] = useState<any[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    ApiService.getInvoicesByArtist(Number(user.id), ApiService.getToken())
      .then(setArtistInvoices)
      .catch(() => setArtistInvoices([]));
  }, [user?.id]);

  // --- Add state for copyrights with invoices ---
  const [artistCopyrights, setArtistCopyrights] = useState<any[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    ApiService.getMyCopyrights().then(setArtistCopyrights);
  }, [user?.id]);

  // --- Fetch and filter artist's payments by their copyrights ---
  useEffect(() => {
    if (!user?.id || artistCopyrights.length === 0) return;
    ApiService.getPayments().then((data) => {
      setArtistPayments(
        data.filter((p: any) =>
          artistCopyrights.some((c: any) => c.id === p.copyrightRequestId)
        )
      );
    });
  }, [user?.id, artistCopyrights]);

  // Filter: only show invoices for copyrights that exist for this artist
  const copyrightsWithInvoices = artistCopyrights.filter(c =>
    artistInvoices.some(inv => inv.copyrightRequestId === c.id)
  );
  const invoicesForCopyrights = artistInvoices.filter(inv =>
    copyrightsWithInvoices.some(c => c.id === inv.copyrightRequestId)
  );

  const pendingPayments = artistPayments.filter(req => req.status === 'pending');
  const completedPayments = artistPayments.filter(req => req.status !== 'pending');
  
  const [referenceInputs, setReferenceInputs] = useState<{[id: number]: string}>({});
  const [submitting, setSubmitting] = useState<{[id: number]: boolean}>({});

  const handleReferenceChange = (id: number, value: string) => {
    setReferenceInputs(inputs => ({ ...inputs, [id]: value }));
  };
  const handleReferenceSubmit = async (paymentId: number) => {
    setSubmitting(sub => ({ ...sub, [paymentId]: true }));
    try {
      await ApiService.submitPaymentReference(paymentId, referenceInputs[paymentId], ApiService.getToken());
      // Refresh payments after submission
      const data = await ApiService.getPayments();
      setArtistPayments(
        data.filter((p: any) =>
          artistCopyrights.some((c: any) => c.id === p.copyrightRequestId)
        )
      );
      setReferenceInputs(inputs => ({ ...inputs, [paymentId]: '' }));
    } catch (e) {
      alert('Failed to submit payment reference.');
    } finally {
      setSubmitting(sub => ({ ...sub, [paymentId]: false }));
    }
  };

  // --- Payment status helpers ---
  const statusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Payment';
      case 'awaiting_verification': return 'Awaiting Verification';
      case 'paid': return 'Paid';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };
  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'awaiting_verification': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-600">Manage your payment records</p>
        </div>
      </div>
      
      <Tabs defaultValue="invoices">
        <TabsList className="mb-4">
          <TabsTrigger value="invoices">
            <Banknote className="inline mr-1 h-4 w-4" /> Invoices ({invoicesForCopyrights.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            <BadgeDollarSign className="inline mr-1 h-4 w-4" /> Pending Payments ({pendingPayments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            <Clock className="inline mr-1 h-4 w-4" /> Completed ({completedPayments.length})
          </TabsTrigger>
        </TabsList>

        {/* --- INVOICES TAB --- */}
        <TabsContent value="invoices">
          {invoicesForCopyrights.length > 0 ? (
            <div className="space-y-6">
              {invoicesForCopyrights.map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Invoice</CardTitle>
                        <CardDescription>
                          <span className="font-semibold">Request ID:</span> {invoice.copyrightRequestId}<br/>
                          <span className="font-semibold">Amount:</span> ${invoice.amount}<br/>
                          <span className="font-semibold">Payment Method:</span> {invoice.paymentMethod || 'N/A'}<br/>
                          <span className="font-semibold">Payment Number:</span> <span className="font-mono">{invoice.paymentNumber || 'N/A'}</span><br/>
                          <span className="font-semibold">Status:</span> {invoice.status}<br/>
                        </CardDescription>
                      </div>
                      <Badge className={statusColor(invoice.status)}>{statusLabel(invoice.status)}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Banknote className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No invoices for your copyrights yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* --- PENDING PAYMENTS TAB --- */}
        <TabsContent value="pending">
          {pendingPayments.length > 0 ? (
            <div className="space-y-6">
              {pendingPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Invoice for Copyright Registration</CardTitle>
                        <CardDescription>
                          <span className="font-semibold">Request ID:</span> {payment.copyrightRequestId}<br/>
                          <span className="font-semibold">Amount:</span> ${payment.amount}<br/>
                          <span className="font-semibold">Payment Method:</span> {payment.paymentMethod}<br/>
                          <span className="font-semibold">Payment Number:</span> <span className="font-mono">{payment.paymentNumber}</span>
                        </CardDescription>
                      </div>
                      <Badge className={statusColor(payment.status)}>{statusLabel(payment.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="mt-4">
                        <label className="block font-medium mb-1">Enter Payment Confirmation/Reference</label>
                        <Input
                          type="text"
                          className="border rounded px-3 py-2 w-full md:w-1/2"
                          placeholder="e.g. M-Pesa transaction code, bank ref"
                          value={referenceInputs[payment.id] || ''}
                          onChange={e => handleReferenceChange(payment.id, e.target.value)}
                          disabled={submitting[payment.id]}
                        />
                        <Button
                          className="mt-2"
                          onClick={() => handleReferenceSubmit(payment.id)}
                          disabled={!referenceInputs[payment.id] || submitting[payment.id]}
                        >
                          Submit Confirmation
                        </Button>
                      </div>
                      <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p className="text-sm">
                          Please pay using the above payment details and submit your confirmation code here. Your copyright will be processed after payment is confirmed by the cashier.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <BadgeDollarSign className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No pending payments.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* --- COMPLETED PAYMENTS TAB --- */}
        <TabsContent value="completed">
          {completedPayments.length > 0 ? (
            <div className="space-y-6">
              {completedPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Copyright Payment</CardTitle>
                        <CardDescription>
                          <span className="font-semibold">Request ID:</span> {payment.copyrightRequestId}<br/>
                          <span className="font-semibold">Amount:</span> ${payment.amount}<br/>
                          <span className="font-semibold">Payment Method:</span> {payment.paymentMethod}<br/>
                          <span className="font-semibold">Payment Number:</span> <span className="font-mono">{payment.paymentNumber}</span><br/>
                          <span className="font-semibold">Your Confirmation:</span> <span className="font-mono">{payment.paymentReference || 'N/A'}</span>
                        </CardDescription>
                      </div>
                      <Badge className={statusColor(payment.status)}>{statusLabel(payment.status)}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No completed payments.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistPayments;
