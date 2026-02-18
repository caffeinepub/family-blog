import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, ImageOff } from 'lucide-react';
import { formatDate } from '../../utils/format';
import { getPhotoPreviewUrl, hasValidPhoto } from '../../utils/photos';
import type { Post } from '../../backend';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const preview = post.body.length > 200 ? post.body.slice(0, 200) + '...' : post.body;
  const hasPhoto = hasValidPhoto(post.photo);

  return (
    <Link to="/post/$postId" params={{ postId: post.id.toString() }}>
      <Card className="hover:shadow-warm transition-shadow cursor-pointer border-border overflow-hidden">
        {hasPhoto ? (
          <div className="w-full h-48 overflow-hidden">
            <img
              src={getPhotoPreviewUrl(post.photo)}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ImageOff className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Photo unavailable</p>
            </div>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-2xl font-serif leading-tight hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed line-clamp-3">{preview}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{post.author.toString().slice(0, 8)}...</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <time>{formatDate(post.timestamp)}</time>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
