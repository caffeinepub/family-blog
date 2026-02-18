import { Link } from '@tanstack/react-router';
import LoginButton from '../auth/LoginButton';
import IdentityIndicator from '../auth/IdentityIndicator';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function AppHeader() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Banner */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1600/500', maxHeight: '200px' }}>
          <img
            src="/assets/generated/family-blog-banner.dim_1600x500.png"
            alt="Family Blog Banner"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/assets/generated/family-blog-logo.dim_512x512.png"
              alt="Family Blog Logo"
              className="w-12 h-12 rounded-lg"
              loading="eager"
            />
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Family Blog</h1>
              <p className="text-sm text-muted-foreground">Sharing our stories</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated && <IdentityIndicator />}
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}

