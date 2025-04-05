
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCopyrightRequests, mockAudios } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, AlertTriangle, Calendar, CheckCircle, FileCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminPayments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const isCashier = user?.role === 'cashier';
  
  // Filter copyright requests with pending payment
  const pendingPayments = mockCopyrightRequests.filter(req => req.paymentStatus === 'pending');
  const processedPayments = mockCopyrightRequests.filter(req => req.paymentStatus !== 'pending');
  
  const handleAcceptPayment = (requestId: string) => {
    if (!isCashier) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to process payments.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Payment Accepted",
      description: "The payment has been processed successfully.",
    });
  };
  
  const handleWaivePayment = (requestId: string) => {
    if (!isCashier) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to waive payments.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Payment Waived",
      description: "The payment requirement has been waived for this request.",
    });
  };
  
  const getAudio = (audioId: string) => {
    return mockAudios.find(audio => audio.id === audioId);
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
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Payments ({pendingPayments.length})</TabsTrigger>
          <TabsTrigger value="processed">Processed Payments ({processedPayments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingPayments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <DollarSign className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No pending payments at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingPayments.map((request) => {
                const audio = getAudio(request.audioId);
                
                return (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Copyright Registration Payment</CardTitle>
                          <CardDescription>
                            Request ID: {request.id} | Submitted: {new Date(request.submissionDate).toLocaleDateString()}
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
                            <h3 className="font-medium">Audio: {audio?.title}</h3>
                            <p className="text-gray-600 mt-1">
                              Artist: {audio?.artistName}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 md:mt-0">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-600">Fee: $50</span>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="receiptNumber" className="text-sm font-medium">Receipt Number</label>
                            <Input 
                              id="receiptNumber" 
                              placeholder="Enter receipt number"
                              disabled={!isCashier}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="paymentDate" className="text-sm font-medium">Payment Date</label>
                            <Input 
                              id="paymentDate" 
                              type="date"
                              defaultValue={new Date().toISOString().split('T')[0]}
                              disabled={!isCashier}
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => handleWaivePayment(request.id)}
                            disabled={!isCashier}
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Waive Payment
                          </Button>
                          <Button 
                            onClick={() => handleAcceptPayment(request.id)}
                            disabled={!isCashier}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Payment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="processed">
          {processedPayments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Calendar className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 text-center">No processed payments yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {processedPayments.map((request) => {
                const audio = getAudio(request.audioId);
                const isPaid = request.paymentStatus === 'paid';
                
                return (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>Copyright Registration Payment</CardTitle>
                          <CardDescription>
                            Request ID: {request.id} | Processed: {request.paymentDate ? new Date(request.paymentDate).toLocaleDateString() : 'N/A'}
                          </CardDescription>
                        </div>
                        <Badge className={isPaid 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-blue-100 text-blue-800 border-blue-200"
                        }>
                          {isPaid ? 'Paid' : 'Waived'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-medium">Audio: {audio?.title}</h3>
                            <p className="text-gray-600 mt-1">
                              Artist: {audio?.artistName}
                            </p>
                          </div>
                          {isPaid && request.paymentAmount && (
                            <div className="flex items-center space-x-2 mt-2 md:mt-0">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-600">Fee: ${request.paymentAmount}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end">
                          <Button variant="outline" asChild>
                            <a href="#view-details" onClick={(e) => e.preventDefault()}>
                              <FileCheck className="mr-2 h-4 w-4" />
                              View Certificate
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPayments;
