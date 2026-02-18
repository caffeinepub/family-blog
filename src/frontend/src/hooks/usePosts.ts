import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Post, PostId } from '../backend';

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getAllPosts();
      // Backend returns sorted by timestamp ascending, reverse for newest first
      return posts.reverse();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPost(postId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Post | null>({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!actor || !postId) return null;
      try {
        return await actor.getPost(BigInt(postId));
      } catch (error) {
        console.error('Failed to fetch post:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, body, photo }: { title: string; body: string; photo: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(title, body, photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, title, body, photo }: { postId: PostId; title: string; body: string; photo: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePost(postId, title, body, photo);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId.toString()] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
