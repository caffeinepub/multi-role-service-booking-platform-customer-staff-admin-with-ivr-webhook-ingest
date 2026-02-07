import { Link } from '@tanstack/react-router';
import { useGetServiceCategories, useGetSubscriptionPlans } from '../../hooks/useQueries';

const categoryIcons: Record<string, string> = {
  'Plumber': '/assets/generated/cat-plumber.dim_256x256.png',
  'Electrician': '/assets/generated/cat-electrician.dim_256x256.png',
  'Electronics Repair': '/assets/generated/cat-electronics-repair.dim_256x256.png',
  'Pest Control': '/assets/generated/cat-pest-control.dim_256x256.png',
  'Car Wash': '/assets/generated/cat-car-wash.dim_256x256.png',
};

export default function CatalogPage() {
  const { data: categories = [], isLoading: categoriesLoading } = useGetServiceCategories();
  const { data: plans = [], isLoading: plansLoading } = useGetSubscriptionPlans();

  if (categoriesLoading || plansLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Our Services</h1>
        <p className="text-muted-foreground">Choose from our wide range of home services</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Service Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id.toString()}
              to="/customer/book"
              search={{ categoryId: category.id.toString() }}
              className="bg-card border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="flex items-start gap-4">
                <img 
                  src={categoryIcons[category.name] || '/assets/generated/cat-plumber.dim_256x256.png'} 
                  alt={category.name}
                  className="h-16 w-16 object-contain"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {plans.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id.toString()} className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-4">₹{plan.price.toString()}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                <Link
                  to="/customer/subscriptions"
                  className="block w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
