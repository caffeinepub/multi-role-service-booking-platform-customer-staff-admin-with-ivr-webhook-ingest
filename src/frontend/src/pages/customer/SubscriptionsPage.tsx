import { useGetSubscriptionPlans } from '../../hooks/useQueries';
import { Check } from 'lucide-react';

export default function SubscriptionsPage() {
  const { data: plans = [], isLoading } = useGetSubscriptionPlans();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground">Choose a plan that works for you</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id.toString()} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹{plan.price.toString()}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">Priority booking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">Discounted rates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm">24/7 support</span>
              </li>
            </ul>
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Demo Mode:</strong> Subscription payments are not processed in this demo. Contact support for actual subscription setup.
        </p>
      </div>
    </div>
  );
}
