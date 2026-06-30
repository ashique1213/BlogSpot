import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Clock } from 'lucide-react';
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
  publish_date: string;
  reads: number;
  likes: number;
  liked?: boolean;
  cover_image_url?: string | null;
}

export function Profile() {
  const { username } = useParams<{ username: string }>();

  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['posts', 'user', username],
    queryFn: async () => {
      const response = await api.get('/api/posts/', { params: { author: username } });
      return response.data;
    },
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-8">
        <div className="h-40 bg-muted/50 rounded-2xl animate-pulse" />
        <div className="space-y-6">
          {[1, 2].map((n) => (
            <Card key={n} className="w-full h-48 animate-pulse bg-muted/50 border-none" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !posts) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <p className="text-muted-foreground">The user you are looking for does not exist or has no published posts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-card p-8 rounded-3xl border border-border/50 shadow-sm">
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}`} alt={username} />
          <AvatarFallback className="text-4xl">{username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">{username}</h1>
            <p className="text-muted-foreground mt-1">Joined BlogSpot to share ideas.</p>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground">
            <div>
              <span className="font-bold text-foreground block md:inline">{posts.length}</span> Stories
            </div>
            <div>
              <span className="font-bold text-foreground block md:inline">{posts.reduce((acc, post) => acc + post.likes, 0)}</span> Total Likes
            </div>
            <div>
              <span className="font-bold text-foreground block md:inline">{posts.reduce((acc, post) => acc + post.reads, 0)}</span> Total Reads
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts Feed */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Stories by {username}</h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
            {username} hasn't published any stories yet.
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border-border/40 bg-card hover:bg-accent/5 transition-colors duration-300 overflow-hidden group">
                  {post.cover_image_url && (
                    <div className="w-full h-56 overflow-hidden border-b border-border/40">
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8 border border-border/50">
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.author.username}`} />
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{post.author.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.publish_date || Date.now()).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <Link to={`/post/${post.id}`}>
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
                      <span className="flex items-center gap-1.5 px-2">
                        <Heart className="h-4 w-4" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1.5 px-2">
                        <Clock className="h-4 w-4" /> {post.reads} reads
                      </span>
                    </div>
                    <Link to={`/post/${post.id}`}>
                      <Button variant="secondary" size="sm" className="rounded-full font-medium">Read more</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
