import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img 
            src="/assets/generated/servicehub-logo.dim_512x512.png" 
            alt="ServiceHub" 
            className="h-24 w-24 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">Welcome to ServiceHub</h1>
          <p className="text-muted-foreground">
            Your trusted platform for home services
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
          </button>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Secure authentication powered by Internet Computer
          </p>
        </div>
      </div>
    </div>
  );
}
