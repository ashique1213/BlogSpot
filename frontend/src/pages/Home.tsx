import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: {
    username: string;
    email: string;
  };
  created_at: string;
  reads: number;
  likes_count: number;
  is_liked?: boolean;
}

export function Home() {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get('/api/posts/');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="w-full h-48 animate-pulse bg-muted/50 border-none" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Failed to load posts.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Latest Stories</h1>
        <p className="text-muted-foreground text-lg">Discover ideas, thinking, and expertise.</p>
      </div>

      <div className="space-y-8">
        {posts?.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border-border/40 bg-card hover:bg-accent/5 transition-colors duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.author.username}`} />
                    <AvatarFallback>{post.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{post.author.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <Link to={`/post/${post.slug}`}>
                  <CardTitle className="text-2xl hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.content.replace(/<[^>]*>?/gm, '')}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4" /> {post.likes_count}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {post.reads} reads
                  </span>
                </div>
                <Link to={`/post/${post.slug}`}>
                  <Button variant="ghost" size="sm" className="rounded-full">Read more</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.article>
        ))}

        {posts?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No posts found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
