import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { ImagePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export function Write() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  useEffect(() => {
    if (id) {
      api.get(`/api/posts/${id}/`).then(res => {
        const post = res.data;
        setTitle(post.title);
        if (editor) {
          editor.commands.setContent(post.content);
        }
        if (post.cover_image_url) {
          setCoverImagePreview(post.cover_image_url);
        }
      }).catch(() => {
        toast.error('Failed to load post');
      });
    }
  }, [id, editor]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    // If editing, they might want to clear the existing image
    // This requires sending cover_image = null or empty string to backend, 
    // but for now we just don't append it to formData.
  };

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
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('content', editor.getHTML());
      formData.append('status', status);
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }
      
      let response;
      if (id) {
        response = await api.patch(`/api/posts/${id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/api/posts/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
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
        {coverImagePreview ? (
          <div className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden group">
            <img src={coverImagePreview} alt="Cover preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="destructive" size="sm" onClick={removeImage} className="gap-2">
                <X className="h-4 w-4" /> Remove Cover
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleImageChange} 
              className="hidden" 
              id="cover-upload"
            />
            <label htmlFor="cover-upload" className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium cursor-pointer hover:bg-muted/50 transition-colors text-muted-foreground">
              <ImagePlus className="h-4 w-4" />
              Add cover image
            </label>
          </div>
        )}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-5xl sm:text-6xl font-extrabold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 text-foreground resize-none pt-4"
        />
        
        <div className="pt-4">
          <EditorContent editor={editor} />
        </div>
      </div>
    </motion.div>
  );
}
