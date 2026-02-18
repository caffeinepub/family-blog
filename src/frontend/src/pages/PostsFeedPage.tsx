import { Link } from '@tanstack/react-router';
import { useGetAllPosts } from '../hooks/usePosts';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PostCard from '../components/posts/PostCard';
import { Button } from '@/components/ui/button';
import { PenSquare, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PostsFeedPage() {
  const { identity } = useInternetIdentity();
  const { data: posts, isLoading, error } = useGetAllPosts();
  const isAuthenticated = !!identity;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Our Stories</h1>
          <p className="text-muted-foreground">Moments and memories from our family</p>
        </div>
        {isAuthenticated && (
          <Link to="/new">
            <Button className="gap-2">
              <PenSquare className="w-4 h-4" />
              New Post
            </Button>
          </Link>
        )}
      </div>

      {!isAuthenticated && (
        <Alert className="mb-8 bg-accent/50 border-accent">
          <AlertDescription>
            Sign in to read and share family stories.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>
            Failed to load posts. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && posts && posts.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <PenSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-serif font-semibold mb-2">No stories yet</h2>
          <p className="text-muted-foreground mb-6">
            {isAuthenticated
              ? 'Be the first to share a family story!'
              : 'Sign in to start sharing family stories.'}
          </p>
          {isAuthenticated && (
            <Link to="/new">
              <Button>Write Your First Post</Button>
            </Link>
          )}
        </div>
      )}

      {!isLoading && posts && posts.length > 0 && (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id.toString()} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

