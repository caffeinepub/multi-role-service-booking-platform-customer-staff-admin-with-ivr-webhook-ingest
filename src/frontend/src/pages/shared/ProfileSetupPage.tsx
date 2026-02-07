import { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import MobileVerificationCard from '../../components/verification/MobileVerificationCard';
import { AppRole } from '../../backend';

export default function ProfileSetupPage() {
  const { data: profile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const navigate = useNavigate();

  const [name, setName] = useState(profile?.name || '');
  const [mobileNumber, setMobileNumber] = useState(profile?.mobileNumber || '');
  const [zone, setZone] = useState(profile?.zone || '');
  const [appRole, setAppRole] = useState<AppRole>(profile?.appRole || AppRole.customer);

  const handleSave = async () => {
    try {
      await saveProfile.mutateAsync({
        name,
        mobileNumber,
        zone,
        appRole,
        isVerified: profile?.isVerified || false,
      });
      
      if (profile?.isVerified) {
        navigate({ to: '/' });
      }
    } catch (error: any) {
      console.error('Failed to save profile:', error);
    }
  };

  const canSave = name.trim() && mobileNumber.trim();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-lg border p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mobile Number *</label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="10-digit mobile number"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Zone / Area</label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="e.g., North Zone, Downtown"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={appRole}
                onChange={(e) => setAppRole(e.target.value as AppRole)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value={AppRole.customer}>Customer</option>
                <option value={AppRole.staff}>Staff</option>
                <option value={AppRole.admin}>Admin</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={!canSave || saveProfile.isPending}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saveProfile.isPending ? 'Saving...' : 'Save Profile'}
            </button>

            {profile && !profile.isVerified && mobileNumber && (
              <div className="mt-6">
                <MobileVerificationCard mobileNumber={mobileNumber} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
