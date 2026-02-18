import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetPost, useCreatePost, useUpdatePost } from '../hooks/usePosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PostEditorPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const params = useParams({ strict: false });
  const postId = 'postId' in params ? params.postId : undefined;
  const isEditing = !!postId;

  const { data: existingPost, isLoading: loadingPost } = useGetPost(postId);
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setBody(existingPost.body);
    }
  }, [existingPost]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!body.trim()) {
      toast.error('Please enter some content');
      return;
    }

    try {
      if (isEditing && postId) {
        await updatePost.mutateAsync({
          postId: BigInt(postId),
          title: title.trim(),
          body: body.trim(),
        });
        toast.success('Post updated successfully!');
        navigate({ to: '/post/$postId', params: { postId } });
      } else {
        const newPostId = await createPost.mutateAsync({
          title: title.trim(),
          body: body.trim(),
        });
        toast.success('Post created successfully!');
        navigate({ to: '/post/$postId', params: { postId: newPostId.toString() } });
      }
    } catch (error) {
      console.error('Failed to save post:', error);
      toast.error('Failed to save post. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>
            You must be signed in to create or edit posts.
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

  if (isEditing && loadingPost) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isEditing && !existingPost) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>
            Post not found.
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

  const isPending = createPost.isPending || updatePost.isPending;

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

      <Card className="shadow-warm">
        <CardHeader>
          <CardTitle className="text-3xl font-serif">
            {isEditing ? 'Edit Your Story' : 'Share a New Story'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your story a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Your Story</Label>
            <Textarea
              id="body"
              placeholder="Share your thoughts, memories, and moments..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              className="resize-none font-serif text-base leading-relaxed"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? 'Update Post' : 'Publish Post'}
                </>
              )}
            </Button>
            <Link to="/">
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

