import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Clock, Trash2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  publish_date: string;
  reads: number;
  likes: number;
  status: string;
  cover_image_url?: string | null;
  author: {
    username: string;
  };
}

export function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['my-posts'],
    queryFn: async () => {
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
    return <div className="animate-pulse space-y-4 max-w-4xl mx-auto py-8">
      <div className="h-10 w-48 bg-muted rounded"></div>
      <div className="h-40 bg-muted rounded"></div>
      <div className="h-40 bg-muted rounded"></div>
    </div>;
  }

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
                <div className="flex-1 flex flex-col sm:flex-row gap-4">
                  {post.cover_image_url && (
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md border border-border/40">
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex gap-2 items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'}`}>
                        {post.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">{new Date(post.publish_date || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <Link to={`/post/${post.id}`}>
                      <h2 className="text-xl font-bold hover:text-primary mb-2 line-clamp-1">{post.title}</h2>
                    </Link>
                    <p className="text-muted-foreground text-sm line-clamp-2 pr-4">{post.content.replace(/<[^>]*>?/gm, '')}</p>
                    
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {post.likes}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.reads} reads</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-center sm:items-end justify-center sm:justify-start gap-2 mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/edit/${post.id}`)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your post "{post.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteMutation.mutate(post.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
