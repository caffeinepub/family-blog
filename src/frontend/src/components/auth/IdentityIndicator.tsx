import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function IdentityIndicator() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (!identity || isLoading) {
    return null;
  }

  const displayName = userProfile?.name || identity.getPrincipal().toString().slice(0, 8) + '...';

  return (
    <Badge variant="secondary" className="gap-2 px-3 py-1.5">
      <User className="w-3.5 h-3.5" />
      <span className="font-medium">{displayName}</span>
    </Badge>
  );
}

