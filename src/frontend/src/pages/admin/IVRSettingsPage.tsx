import { useState } from 'react';
import { Phone } from 'lucide-react';

export default function IVRSettingsPage() {
  const [providerName, setProviderName] = useState('Twilio');
  const [ivrNumber, setIvrNumber] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In demo mode, just store locally
    localStorage.setItem('ivr_settings', JSON.stringify({
      providerName,
      ivrNumber,
      webhookSecret,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Phone className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">IVR Settings</h1>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Demo Mode:</strong> IVR settings are stored locally. In production, these would be securely stored in the backend.
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">IVR Provider</label>
          <select
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="Twilio">Twilio</option>
            <option value="Exotel">Exotel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">IVR Number</label>
          <input
            type="text"
            value={ivrNumber}
            onChange={(e) => setIvrNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
            placeholder="e.g., +1-800-123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Webhook Secret / Token</label>
          <input
            type="password"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
            placeholder="Enter webhook authentication token"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          {saved ? 'Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
