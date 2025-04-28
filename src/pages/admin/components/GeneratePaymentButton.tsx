import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ApiService from '../../../services/ApiService';
import { useToast } from '@/hooks/use-toast';

interface GeneratePaymentButtonProps {
  copyrightId: number;
  artistId: number;
  amount: number;
  disabled?: boolean;
  onPaymentCreated?: () => void;
}

const GeneratePaymentButton: React.FC<GeneratePaymentButtonProps> = ({ copyrightId, artistId, amount, disabled, onPaymentCreated }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGeneratePayment = async () => {
    setLoading(true);
    try {
      const token = ApiService.getToken();
      await ApiService.createPayment({
        copyrightRequestId: copyrightId,
        artistId,
        amount,
      }, token);
      toast({ title: 'Payment Generated', description: 'Payment request created for artist.' });
      if (onPaymentCreated) onPaymentCreated();
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to generate payment', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleGeneratePayment} disabled={disabled || loading}>
      {loading ? 'Generating...' : 'Generate Payment'}
    </Button>
  );
};

export default GeneratePaymentButton;
