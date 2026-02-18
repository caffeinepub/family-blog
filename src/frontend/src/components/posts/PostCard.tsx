import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/format';
import type { Post } from '../../backend';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const preview = post.body.length > 200 ? post.body.slice(0, 200) + '...' : post.body;

  return (
    <Link to="/post/$postId" params={{ postId: post.id.toString() }}>
      <Card className="hover:shadow-warm transition-shadow cursor-pointer border-border">
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

