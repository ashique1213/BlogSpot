import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export function Write() {
  const [title, setTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Tell your story...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-neutral dark:prose-invert prose-lg max-w-none focus:outline-none min-h-[50vh]',
      },
    },
  });

  const handlePublish = async (status: 'published' | 'draft') => {
    if (!title.trim()) {
      toast.error('Please add a title before saving.');
      return;
    }
    
    if (!editor?.getHTML() || editor.getHTML() === '<p></p>') {
      toast.error('Please write some content before saving.');
      return;
    }

    setIsPublishing(true);
    try {
      // Create a slug from title
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const response = await api.post('/api/posts/', {
        title,
        slug,
        content: editor.getHTML(),
        status
      });
      
      toast.success(status === 'published' ? 'Story published!' : 'Draft saved!');
      navigate(status === 'published' ? `/post/${response.data.slug || response.data.id}` : '/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save story');
    } finally {
      setIsPublishing(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">You must be logged in to write</h2>
        <Button onClick={() => navigate('/login')} className="rounded-full">Log in</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-muted-foreground font-medium">
          Draft in {user.username}
        </span>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="rounded-full"
            onClick={() => handlePublish('draft')}
            disabled={isPublishing}
          >
            Save draft
          </Button>
          <Button 
            className="rounded-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handlePublish('published')}
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-5xl sm:text-6xl font-extrabold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 text-foreground resize-none"
        />
        
        <div className="pt-4">
          <EditorContent editor={editor} />
        </div>
      </div>
    </motion.div>
  );
}
