
import { ThumbsUp, MessageCircle, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface NewsCardProps {
  id: string;
  title: string;
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  category: string;
  isLiked?: boolean;
  onLikeUpdate?: (newLikeCount: number, isLiked: boolean) => void;
  onShare?: () => void;
}

const NewsCard = ({ 
  id,
  title, 
  content, 
  timeAgo, 
  likes, 
  comments, 
  category,
  isLiked = false,
  onLikeUpdate,
  onShare
}: NewsCardProps) => {
  const [likesCount, setLikesCount] = useState(likes);
  const [isUserLiked, setIsUserLiked] = useState(isLiked);
  const [isLiking, setIsLiking] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like articles",
        variant: "destructive"
      });
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      if (isUserLiked) {
        // Unlike the article
        const { error } = await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', id)
          .eq('user_id', user.id);

        if (!error) {
          const newLikeCount = likesCount - 1;
          setLikesCount(newLikeCount);
          setIsUserLiked(false);
          
          // Update the article's like count
          await supabase
            .from('articles')
            .update({ likes_count: newLikeCount })
            .eq('id', id);
            
          onLikeUpdate?.(newLikeCount, false);
        }
      } else {
        // Like the article
        const { error } = await supabase
          .from('article_likes')
          .insert({
            article_id: id,
            user_id: user.id
          });

        if (!error) {
          const newLikeCount = likesCount + 1;
          setLikesCount(newLikeCount);
          setIsUserLiked(true);
          
          // Update the article's like count
          await supabase
            .from('articles')
            .update({ likes_count: newLikeCount })
            .eq('id', id);
            
          onLikeUpdate?.(newLikeCount, true);
        }
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.();
  };

  return (
    <article className="news-card p-6 border hover:border-primary/20 group cursor-pointer">
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent-foreground">
          {category}
        </span>
        <div className="flex items-center text-muted-foreground text-sm">
          <User className="h-4 w-4 mr-1" />
          Anonymous
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-xl text-hero-text mb-3 group-hover:text-primary transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Content Preview */}
      <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
        {content}
      </p>

      {/* Meta Info */}
      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm text-muted-foreground">{timeAgo}</span>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`hover:bg-primary/10 hover:text-primary ${isUserLiked ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <ThumbsUp className={`h-4 w-4 mr-1 ${isUserLiked ? 'fill-current' : ''}`} />
            {likesCount}
          </Button>
          
          <Button variant="ghost" size="sm" className="hover:bg-secondary/10 hover:text-secondary text-muted-foreground">
            <MessageCircle className="h-4 w-4 mr-1" />
            {comments}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-accent/10 hover:text-accent-foreground text-muted-foreground"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
