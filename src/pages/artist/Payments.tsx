
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ApiService from '../../services/ApiService';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, FileText, Clock, AlertCircle } from 'lucide-react';

const ArtistPayments = () => {
  const { user } = useAuth();
  
  // Fetch payment records for the current artist from backend
  const [artistPayments, setArtistPayments] = useState<any[]>([]);
  useEffect(() => {
    ApiService.getPayments().then((data) => {
      setArtistPayments(data.filter((req: any) => req.artistId === user?.id));
    });
  }, [user?.id]);

  const pendingPayments = artistPayments.filter(req => req.paymentStatus === 'pending');
  const completedPayments = artistPayments.filter(req => req.paymentStatus !== 'pending');
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-600">Manage your payment records</p>
        </div>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending ({pendingPayments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedPayments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingPayments.length > 0 ? (
            <div className="space-y-6">
              {pendingPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Copyright Registration Fee</CardTitle>
                        <CardDescription>
                          Request ID: {payment.id.substring(0, 8)} | Submitted: {new Date(payment.submissionDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Payment Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">Audio ID: {payment.audioId}</h3>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 md:mt-0">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-600">Fee: $50</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-4">
                        <h3 className="font-medium">Payment Options</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded-md p-4 flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-gray-500" />
                            <div>
                              <h4 className="font-medium">Credit Card</h4>
                              <p className="text-sm text-gray-500">Pay securely online</p>
                            </div>
                          </div>
                          <div className="border rounded-md p-4 flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <div>
                              <h4 className="font-medium">Bank Transfer</h4>
                              <p className="text-sm text-gray-500">Pay via bank transfer</p>
                            </div>
                          </div>
                        </div>
                        
                        <Button className="w-full md:w-auto md:self-end">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Make Payment
                        </Button>
                      </div>
                      
                      <div className="flex items-center p-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p className="text-sm">
                          Your copyright will be processed after payment is confirmed. The processing typically takes 3-5 business days.
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
                <DollarSign className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No pending payments.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedPayments.length > 0 ? (
            <div className="space-y-6">
              {completedPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Copyright Registration Fee</CardTitle>
                        <CardDescription>
                          Request ID: {payment.id.substring(0, 8)} | Completed: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                        </CardDescription>
                      </div>
                      <Badge className={payment.paymentStatus === 'paid' 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-blue-100 text-blue-800 border-blue-200"
                      }>
                        {payment.paymentStatus === 'paid' ? 'Paid' : 'Waived'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">Audio ID: {payment.audioId}</h3>
                        </div>
                        {payment.paymentStatus === 'paid' && payment.paymentAmount && (
                          <div className="flex items-center space-x-2 mt-2 md:mt-0">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-600">Amount: ${payment.paymentAmount}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Payment Method</h3>
                          <p className="text-gray-600">{payment.paymentStatus === 'paid' ? 'Credit Card' : 'Fee Waived'}</p>
                        </div>
                        <Button variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No completed payments yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistPayments;
