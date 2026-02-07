import { useState } from 'react';
import { useGetServiceCategories, useGetSubscriptionPlans, useCreateServiceCategory, useCreateSubscriptionPlan } from '../../hooks/useQueries';
import { Plus } from 'lucide-react';

export default function ManageServicesPage() {
  const { data: categories = [] } = useGetServiceCategories();
  const { data: plans = [] } = useGetSubscriptionPlans();
  const createCategory = useCreateServiceCategory();
  const createPlan = useCreateSubscriptionPlan();

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);

  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');

  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory.mutateAsync({ name: categoryName, description: categoryDesc });
      setCategoryName('');
      setCategoryDesc('');
      setShowCategoryForm(false);
      alert('Category created successfully!');
    } catch (error: any) {
      alert('Failed to create category: ' + error.message);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPlan.mutateAsync({ name: planName, price: BigInt(planPrice) });
      setPlanName('');
      setPlanPrice('');
      setShowPlanForm(false);
      alert('Plan created successfully!');
    } catch (error: any) {
      alert('Failed to create plan: ' + error.message);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Services</h1>

      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Service Categories</h2>
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        {showCategoryForm && (
          <form onSubmit={handleCreateCategory} className="mb-6 p-4 bg-accent/10 rounded-md space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={categoryDesc}
                onChange={(e) => setCategoryDesc(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                rows={2}
                required
              />
            </div>
            <button
              type="submit"
              disabled={createCategory.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createCategory.isPending ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        )}

        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id.toString()} className="p-4 bg-accent/10 rounded-md">
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Subscription Plans</h2>
          <button
            onClick={() => setShowPlanForm(!showPlanForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Plan
          </button>
        </div>

        {showPlanForm && (
          <form onSubmit={handleCreatePlan} className="mb-6 p-4 bg-accent/10 rounded-md space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price (₹)</label>
              <input
                type="number"
                value={planPrice}
                onChange={(e) => setPlanPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                required
              />
            </div>
            <button
              type="submit"
              disabled={createPlan.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createPlan.isPending ? 'Creating...' : 'Create Plan'}
            </button>
          </form>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.id.toString()} className="p-4 bg-accent/10 rounded-md">
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="text-2xl font-bold mt-2">₹{plan.price.toString()}<span className="text-sm font-normal">/mo</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
