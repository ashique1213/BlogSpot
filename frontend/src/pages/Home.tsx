import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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

const TOPICS = ['Programming', 'Machine Learning', 'Productivity', 'React', 'Python', 'Web Development'];

export function Home() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get('/api/posts/');
      return response.data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await api.post(`/api/posts/${postId}/like/`);
      return { data: response.data, postId };
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData<Post[]>(['posts']);
      
      if (previousPosts) {
        queryClient.setQueryData<Post[]>(['posts'], old => 
          old?.map(p => p.id === postId ? { 
            ...p, 
            liked: !p.liked, 
            likes: p.liked ? p.likes - 1 : p.likes + 1 
          } : p)
        );
      }
      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      toast.error('Failed to like post');
    },
    onSettled: (_data, _error, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="w-full h-48 animate-pulse bg-muted/50 border-none" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Failed to load posts.</div>;
  }

  // Get top 3 trending posts based on reads + likes (naive approach)
  const trendingPosts = [...(posts || [])]
    .sort((a, b) => (b.reads + b.likes) - (a.reads + a.likes))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 py-8">
      {/* Main Feed Column */}
      <div className="space-y-8">
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
              <Card className="border-border/40 bg-card hover:bg-accent/5 transition-colors duration-300 overflow-hidden group">
                {post.cover_image_url && (
                  <div className="w-full h-56 overflow-hidden border-b border-border/40">
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Link to={`/profile/${post.author.username}`}>
                      <Avatar className="h-8 w-8 border border-border/50 hover:ring-2 hover:ring-primary/50 transition-all">
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.author.username}`} />
                        <AvatarFallback>{post.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex flex-col">
                      <Link to={`/profile/${post.author.username}`} className="hover:underline">
                        <span className="text-sm font-medium">{post.author.username}</span>
                      </Link>
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => user ? likeMutation.mutate(post.id) : toast.error('Please log in to like')}
                      className={`gap-1.5 rounded-full px-2 ${post.liked ? 'text-red-500 hover:text-red-600' : ''}`}
                    >
                      <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} /> {post.likes}
                    </Button>
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

          {posts?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No posts found. Check back later!
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Column */}
      <aside className="hidden lg:block space-y-10 sticky top-24 self-start">
        {/* Trending Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2>Trending on BlogSpot</h2>
          </div>
          <div className="flex flex-col gap-6">
            {trendingPosts.map((post, i) => (
              <div key={post.id} className="flex gap-4 group cursor-pointer">
                <span className="text-3xl font-bold text-muted-foreground/30 group-hover:text-primary/40 transition-colors">
                  0{i + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/profile/${post.author.username}`}>
                      <Avatar className="h-5 w-5 hover:ring-1 hover:ring-primary/50 transition-all">
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.author.username}`} />
                      </Avatar>
                    </Link>
                    <Link to={`/profile/${post.author.username}`} className="hover:underline">
                      <span className="text-xs font-medium text-foreground">{post.author.username}</span>
                    </Link>
                  </div>
                  <Link to={`/post/${post.id}`}>
                    <h3 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <span className="text-xs text-muted-foreground mt-1">
                    {new Date(post.publish_date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Topics */}
        <div className="space-y-4 pt-6 border-t border-border/50">
          <h2 className="font-bold text-lg">Recommended topics</h2>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <Button key={topic} variant="secondary" className="rounded-full text-xs font-medium bg-secondary/50 hover:bg-secondary h-8 px-4">
                {topic}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Footer links placeholder */}
        <div className="pt-6 border-t border-border/50 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground">Help</a>
          <a href="#" className="hover:text-foreground">Status</a>
          <a href="#" className="hover:text-foreground">About</a>
          <a href="#" className="hover:text-foreground">Careers</a>
          <a href="#" className="hover:text-foreground">Blog</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Text to speech</a>
        </div>
      </aside>
    </div>
  );
}
