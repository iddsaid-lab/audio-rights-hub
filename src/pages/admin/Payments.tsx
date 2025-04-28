import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiService from '../../services/ApiService';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BadgeDollarSign, Banknote } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminPayments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const isCashier = user?.role === 'cashier';
  
  // State for payments and loading
  const [pendingPayments, setPendingPayments] = useState<any[]>([]); // payments requested, awaiting artist payment
  const [awaitingVerification, setAwaitingVerification] = useState<any[]>([]); // payments with confirmation
  const [processedPayments, setProcessedPayments] = useState<any[]>([]); // paid/waived
  const [loading, setLoading] = useState(false);

  // Fetch payments on mount
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const token = ApiService.getToken();
        const allPayments = await ApiService.getPayments(token);
        setPendingPayments(allPayments.filter((p: any) => p.status === 'pending'));
        setAwaitingVerification(allPayments.filter((p: any) => p.status === 'awaiting_verification'));
        setProcessedPayments(allPayments.filter((p: any) => p.status === 'paid' || p.status === 'waived'));
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to fetch payments', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);
  
  const handleVerifyPayment = async (payment: any) => {
    if (!isCashier) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to verify payments.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const token = ApiService.getToken();
      await ApiService.approvePayment(payment.id, token);
      toast({ title: 'Payment Approved', description: 'Marked as paid.' });
      // Refresh
      const allPayments = await ApiService.getPayments(token);
      setPendingPayments(allPayments.filter((p: any) => p.status === 'pending'));
      setAwaitingVerification(allPayments.filter((p: any) => p.status === 'awaiting_verification'));
      setProcessedPayments(allPayments.filter((p: any) => p.status === 'paid' || p.status === 'waived'));
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to approve payment', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRequestPayment = async (request: any) => {
    if (!isCashier) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to request payments.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const token = ApiService.getToken();
      await ApiService.createPayment({
        artistId: request.artistId,
        copyrightId: request.copyrightId,
        amount: request.paymentAmount || 50,
      }, token);
      toast({ title: 'Payment Requested', description: 'Payment request sent to artist.' });
      // Refresh
      const allPayments = await ApiService.getPayments(token);
      setPendingPayments(allPayments.filter((p: any) => p.status === 'pending'));
      setAwaitingVerification(allPayments.filter((p: any) => p.status === 'awaiting_verification'));
      setProcessedPayments(allPayments.filter((p: any) => p.status === 'paid' || p.status === 'waived'));
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to request payment', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  
  // Status helpers
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
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-gray-600">Process payments for copyright registrations</p>
        </div>
        <div>
          {!isCashier && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              View Only Mode - {user?.role}
            </Badge>
          )}
        </div>
      </div>
      {loading && <div className="text-center py-4">Loading...</div>}
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            <BadgeDollarSign className="inline mr-1 h-4 w-4" /> Pending ({pendingPayments.length})
          </TabsTrigger>
          <TabsTrigger value="awaiting_verification">
            <Banknote className="inline mr-1 h-4 w-4" /> Awaiting Verification ({awaitingVerification.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            <Banknote className="inline mr-1 h-4 w-4" /> Processed ({processedPayments.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingPayments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <BadgeDollarSign className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No pending invoices.</p>
              </CardContent>
            </Card>
          ) : (
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
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="awaiting_verification">
          {awaitingVerification.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Banknote className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No payments awaiting verification.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {awaitingVerification.map((payment) => (
                <Card key={payment.id} className="shadow-lg border border-blue-100">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {payment.artistName || 'Artist'}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          <span className="font-semibold">Payment Ref:</span> <span className="font-mono">{payment.paymentReference || 'N/A'}</span><br/>
                          <span className="font-semibold">Request ID:</span> {payment.copyrightRequestId}<br/>
                          <span className="font-semibold">Amount:</span> ${payment.amount}<br/>
                          <span className="font-semibold">Payment Method:</span> {payment.paymentMethod}<br/>
                          <span className="font-semibold">Payment Number:</span> <span className="font-mono">{payment.paymentNumber}</span>
                        </CardDescription>
                      </div>
                      <Badge className={statusColor(payment.status)}>
                        {statusLabel(payment.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-gray-500">Submitted: {payment.updatedAt ? new Date(payment.updatedAt).toLocaleString() : 'N/A'}</span>
                        <span className="text-xs text-gray-500">Payment Number: <span className="font-mono">{payment.paymentNumber}</span></span>
                        <span className="text-xs text-gray-500">Artist Confirmation: <span className="font-mono">{payment.paymentReference || 'N/A'}</span></span>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Button
                          variant="success"
                          className="flex items-center gap-1"
                          onClick={async () => {
                            setLoading(true);
                            try {
                              const token = ApiService.getToken();
                              await ApiService.reviewPayment(payment.id, 'approve', token);
                              toast({ title: 'Payment Approved', description: 'Payment marked as paid.' });
                              const allPayments = await ApiService.getPayments(token);
                              setPendingPayments(allPayments.filter((p: any) => p.status === 'pending'));
                              setAwaitingVerification(allPayments.filter((p: any) => p.status === 'awaiting_verification'));
                              setProcessedPayments(allPayments.filter((p: any) => p.status === 'paid' || p.status === 'waived'));
                            } catch (e) {
                              toast({ title: 'Error', description: 'Failed to approve payment', variant: 'destructive' });
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex items-center gap-1"
                          onClick={async () => {
                            setLoading(true);
                            try {
                              const token = ApiService.getToken();
                              await ApiService.reviewPayment(payment.id, 'reject', token);
                              toast({ title: 'Payment Rejected', description: 'Payment marked as rejected.' });
                              const allPayments = await ApiService.getPayments(token);
                              setPendingPayments(allPayments.filter((p: any) => p.status === 'pending'));
                              setAwaitingVerification(allPayments.filter((p: any) => p.status === 'awaiting_verification'));
                              setProcessedPayments(allPayments.filter((p: any) => p.status === 'paid' || p.status === 'waived'));
                            } catch (e) {
                              toast({ title: 'Error', description: 'Failed to reject payment', variant: 'destructive' });
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="processed">
          {processedPayments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Banknote className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No processed payments yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {processedPayments.map((payment) => (
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
                          <span className="font-semibold">Artist Confirmation:</span> <span className="font-mono">{payment.paymentReference || 'N/A'}</span>
                        </CardDescription>
                      </div>
                      <Badge className={statusColor(payment.status)}>{statusLabel(payment.status)}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPayments;
