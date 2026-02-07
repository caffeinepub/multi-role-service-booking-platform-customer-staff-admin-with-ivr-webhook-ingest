import { useState } from 'react';
import { useStartVerification, useCompleteVerification } from '../../hooks/useQueries';

interface Props {
  mobileNumber: string;
}

export default function MobileVerificationCard({ mobileNumber }: Props) {
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const startVerification = useStartVerification();
  const completeVerification = useCompleteVerification();

  const handleRequestOtp = async () => {
    try {
      await startVerification.mutateAsync(mobileNumber);
      // In demo mode, the OTP is always 1234
      setGeneratedOtp('1234');
    } catch (error: any) {
      console.error('Failed to start verification:', error);
    }
  };

  const handleVerify = async () => {
    try {
      const result = await completeVerification.mutateAsync({
        mobileNumber,
        verificationCode: otp,
      });
      
      if (result.verified) {
        alert('Mobile number verified successfully!');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      alert('Verification failed: ' + error.message);
    }
  };

  return (
    <div className="bg-accent/10 rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Verify Mobile Number</h3>
      
      {!generatedOtp ? (
        <button
          onClick={handleRequestOtp}
          disabled={startVerification.isPending}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {startVerification.isPending ? 'Requesting...' : 'Request OTP'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              Demo OTP (Development Mode)
            </p>
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {generatedOtp}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="Enter 4-digit OTP"
              maxLength={4}
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={otp.length !== 4 || completeVerification.isPending}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {completeVerification.isPending ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}
    </div>
  );
}
