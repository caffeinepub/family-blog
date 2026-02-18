import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useGetPost } from '../hooks/usePosts';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import PostActions from '../components/posts/PostActions';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, User } from 'lucide-react';
import { formatDateTime } from '../utils/format';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PostDetailPage() {
  const { postId } = useParams({ from: '/post/$postId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: post, isLoading, error } = useGetPost(postId);
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthor = identity && post && post.author.toString() === identity.getPrincipal().toString();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>
            Post not found or failed to load.
          </AlertDescription>
        </Alert>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Stories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Stories
          </Button>
        </Link>
      </div>

      <article className="bg-card rounded-lg border border-border shadow-warm p-8 md:p-12">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                {isAuthor && userProfile?.name
                  ? userProfile.name
                  : post.author.toString().slice(0, 8) + '...'}
              </span>
            </div>
            <span>•</span>
            <time>{formatDateTime(post.timestamp)}</time>
          </div>

          {isAuthor && (
            <>
              <Separator className="my-6" />
              <PostActions
                postId={post.id}
                onDeleteSuccess={() => navigate({ to: '/' })}
              />
            </>
          )}
        </header>

        <Separator className="my-8" />

        <div className="prose prose-blog max-w-none">
          <div className="text-lg leading-relaxed whitespace-pre-wrap">{post.body}</div>
        </div>
      </article>
    </div>
  );
}

