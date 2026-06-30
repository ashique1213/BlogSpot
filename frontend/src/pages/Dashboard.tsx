import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Clock, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  reads: number;
  likes_count: number;
  status: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['my-posts'],
    queryFn: async () => {
      // Assuming backend allows filtering by author if requested, or if the view automatically filters for user
      // Actually, since we only see all posts or published posts based on staff status,
      // If the user wants only their posts, maybe there's an endpoint? 
      // If not, we will just fetch all and filter client-side for simplicity, or assume it's `/api/posts/` and filter
      const response = await api.get('/api/posts/');
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/posts/${id}/`);
    },
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast.error('Failed to delete post');
    }
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 w-48 bg-muted rounded"></div>
      <div className="h-40 bg-muted rounded"></div>
      <div className="h-40 bg-muted rounded"></div>
    </div>;
  }

  // Assuming user can only edit their own, or if user is admin, they can edit all.
  // For the dashboard, we show posts where author is current user.
  // Wait, the API returns author as an object { username, email }. 
  // We can filter by `author.username === user.username`.
  const myPosts = posts?.filter(p => p.author?.username === user?.username) || [];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Stories</h1>
          <p className="text-muted-foreground mt-2">Manage your published and draft stories.</p>
        </div>
        <Link to="/write">
          <Button className="rounded-full">Write a story</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {myPosts.length === 0 ? (
          <div className="text-center py-20 border rounded-xl border-dashed">
            <p className="text-muted-foreground mb-4">You haven't written any stories yet.</p>
            <Link to="/write">
              <Button variant="outline">Start writing</Button>
            </Link>
          </div>
        ) : (
          myPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="flex flex-col sm:flex-row justify-between p-6">
                <div className="flex-1">
                  <div className="flex gap-2 items-center mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}`}>
                      {post.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <Link to={`/post/${post.slug}`}>
                    <h2 className="text-xl font-bold hover:text-primary mb-2 line-clamp-1">{post.title}</h2>
                  </Link>
                  <p className="text-muted-foreground text-sm line-clamp-2 pr-4">{post.content}</p>
                  
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {post.likes_count}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.reads} reads</span>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-center sm:items-end justify-center sm:justify-start gap-2 mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this post?')) {
                        deleteMutation.mutate(post.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
