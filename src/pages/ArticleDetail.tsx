
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageCircle, Share2, User, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AuthModal from '@/components/AuthModal';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author_name: string;
  created_at: string;
  likes_count: number;
  views_count: number;
}

interface Media {
  id: string;
  file_url: string;
  file_type: string;
  file_name: string;
}

interface Comment {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
  user_id: string;
}

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchArticle();
      fetchMedia();
      fetchComments();
      if (user) {
        checkIfLiked();
      }
    }
  }, [id, user]);

  const checkIfLiked = async () => {
    if (!user || !id) return;
    
    const { data } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', id)
      .eq('user_id', user.id)
      .single();
    
    setIsLiked(!!data);
  };

  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      toast({
        title: "Error",
        description: "Article not found",
        variant: "destructive"
      });
    } else {
      setArticle(data);
      // Increment view count
      await supabase
        .from('articles')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id);
    }
    setLoading(false);
  };

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from('article_media')
      .select('*')
      .eq('article_id', id);

    if (!error && data) {
      setMedia(data);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data);
    }
  };

  const handleLike = async () => {
    if (!article) return;
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      if (isLiked) {
        // Unlike the article
        await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', id)
          .eq('user_id', user.id);
        
        setArticle({ ...article, likes_count: article.likes_count - 1 });
        setIsLiked(false);
        
        await supabase
          .from('articles')
          .update({ likes_count: article.likes_count - 1 })
          .eq('id', id);
      } else {
        // Like the article
        await supabase
          .from('article_likes')
          .insert({
            article_id: id,
            user_id: user.id
          });
        
        setArticle({ ...article, likes_count: article.likes_count + 1 });
        setIsLiked(true);
        
        await supabase
          .from('articles')
          .update({ likes_count: article.likes_count + 1 })
          .eq('id', id);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (!article) return;
    
    const shareUrl = `${window.location.origin}/article/${article.id}`;
    const shareText = `Check out this article: ${article.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: "Link copied to clipboard!"
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        article_id: id,
        user_id: user.id,
        content: newComment,
        author_name: user.user_metadata?.full_name || 'Anonymous'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    } else {
      setNewComment('');
      fetchComments();
      toast({
        title: "Success",
        description: "Comment posted successfully!"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Article not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8">
            {/* Article Header */}
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent-foreground mb-4">
                {article.category}
              </span>
              <h1 className="text-3xl font-display font-bold text-hero-text mb-4">
                {article.title}
              </h1>
              <div className="flex items-center justify-between text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author_name}</span>
                </div>
                <span>{new Date(article.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose max-w-none mb-8">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {article.content}
              </p>
            </div>

            {/* Media Gallery */}
            {media.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {media.map((item) => (
                    <div key={item.id} className="rounded-lg overflow-hidden">
                      {item.file_type === 'image' ? (
                        <img
                          src={item.file_url}
                          alt={item.file_name}
                          className="w-full h-auto object-cover"
                        />
                      ) : (
                        <video
                          src={item.file_url}
                          controls
                          className="w-full h-auto"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Article Actions */}
            <div className="flex items-center justify-between py-4 border-t border-b">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={handleLike}
                  className={isLiked ? 'text-primary' : ''}
                >
                  <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {article.likes_count}
                </Button>
                <Button variant="ghost">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {comments.length}
                </Button>
                <Button variant="ghost" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {article.views_count} views
              </span>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
              
              {/* Add Comment */}
              <div className="mb-6">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={user ? "Write a comment..." : "Please login to comment"}
                  className="mb-3"
                  disabled={!user}
                />
                <Button onClick={handleCommentSubmit} disabled={!user || !newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{comment.author_name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-foreground">{comment.content}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default ArticleDetail;
