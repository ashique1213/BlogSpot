import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';

interface Comment {
  id: number;
  content: string;
  user: {
    username: string;
  };
  created_at: string;
}

interface PostDetail {
  id: number;
  title: string;
  slug: string;
  content: string;
  author: {
    username: string;
  };
  publish_date: string;
  reads: number;
  likes: number;
  liked: boolean;
  comments: Comment[];
  cover_image_url?: string | null;
}

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState('');

  const { data: displayPost, isLoading } = useQuery<PostDetail>({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await api.get(`/api/posts/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/api/posts/${id}/like/`);
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', id] });
      const previousPost = queryClient.getQueryData<PostDetail>(['post', id]);
      
      if (previousPost) {
        queryClient.setQueryData<PostDetail>(['post', id], {
          ...previousPost,
          liked: !previousPost.liked,
          likes: previousPost.liked ? previousPost.likes - 1 : previousPost.likes + 1,
        });
      }
      
      return { previousPost };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['post', id], context.previousPost);
      }
      toast.error('Failed to like post');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await api.post(`/api/comments/`, {
        post: id,
        content
      });
      return response.data;
    },
    onSuccess: () => {
      setCommentContent('');
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast.success('Comment added');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add comment');
    }
  });

  if (isLoading) {
    return <div className="animate-pulse bg-muted h-96 rounded-xl"></div>;
  }

  if (!displayPost) {
    return <div className="text-center text-xl mt-20">Post not found</div>;
  }

  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto py-10"
    >
      {displayPost.cover_image_url && (
        <div className="w-full h-[400px] mb-10 rounded-2xl overflow-hidden shadow-lg border border-border/50">
          <img src={displayPost.cover_image_url} alt={displayPost.title} className="w-full h-full object-cover" />
        </div>
      )}
      <header className="mb-10 space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          {displayPost.title}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${displayPost.author.username}`} />
            <AvatarFallback>{displayPost.author.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{displayPost.author.username}</span>
            <span className="text-sm">
              {new Date(displayPost.publish_date || Date.now()).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })} · {displayPost.reads} reads
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 py-4 border-y border-border/50">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 ${displayPost.liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
            onClick={() => user ? likeMutation.mutate() : toast.error('Please login to like')}
          >
            <Heart className={`h-5 w-5 ${displayPost.liked ? 'fill-current' : ''}`} />
            {displayPost.likes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}>
            <MessageSquare className="h-5 w-5" />
            {displayPost.comments?.length || 0}
          </Button>
        </div>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed mb-16 whitespace-pre-wrap">
        {displayPost.content}
      </div>

      <section id="comments" className="border-t border-border/50 pt-10">
        <h3 className="text-2xl font-bold mb-8">Responses ({displayPost.comments?.length || 0})</h3>
        
        {user ? (
          <div className="mb-10">
            <Textarea 
              placeholder="What are your thoughts?" 
              className="resize-none mb-3 bg-card"
              rows={3}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={() => commentMutation.mutate(commentContent)}
                disabled={!commentContent.trim() || commentMutation.isPending}
                className="rounded-full"
              >
                Respond
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 p-6 rounded-xl text-center mb-10">
            <p className="mb-4 text-muted-foreground">Sign in to leave a response.</p>
            <Link to="/login"><Button className="rounded-full">Log in</Button></Link>
          </div>
        )}

        <div className="space-y-8">
          {displayPost.comments?.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${comment.user.username}`} />
                <AvatarFallback>{comment.user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{comment.user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.article>
  );
}
