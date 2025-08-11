
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from "./NewsCard";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

interface ArticleWithLike extends Article {
  isLiked: boolean;
}

const NewsFeed = () => {
  const [articles, setArticles] = useState<ArticleWithLike[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = ["All", "Campus Life", "Pranks & Fun", "Love Stories", "Achievements", "Study Tips", "Breaking News"];

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, user]);

  const fetchArticles = async () => {
    setLoading(true);
    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedCategory !== "All") {
      query = query.eq('category', selectedCategory);
    }

    const { data: articlesData, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } else {
      // Fetch user likes if user is logged in
      let userLikes: string[] = [];
      if (user && articlesData) {
        const { data: likesData } = await supabase
          .from('article_likes')
          .select('article_id')
          .eq('user_id', user.id)
          .in('article_id', articlesData.map(a => a.id));
        
        userLikes = likesData?.map(like => like.article_id) || [];
      }

      // Add isLiked property to articles
      const articlesWithLikes = articlesData?.map(article => ({
        ...article,
        isLiked: userLikes.includes(article.id)
      })) || [];

      setArticles(articlesWithLikes);
    }
    setLoading(false);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const handleArticleClick = async (articleId: string) => {
    // Increment view count when article is clicked
    const { data: currentArticle } = await supabase
      .from('articles')
      .select('views_count')
      .eq('id', articleId)
      .single();
    
    if (currentArticle) {
      await supabase
        .from('articles')
        .update({ 
          views_count: (currentArticle.views_count || 0) + 1
        })
        .eq('id', articleId);
    }
    
    navigate(`/article/${articleId}`);
  };

  const handleLikeUpdate = (articleId: string, newLikeCount: number, isLiked: boolean) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, likes_count: newLikeCount, isLiked }
        : article
    ));
  };

  const handleShare = async (article: ArticleWithLike) => {
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
      // You could add a toast notification here
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <section className="py-12">
      <div className="container px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-hero-text mb-4">
            Latest Campus Buzz
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fresh stories, hilarious moments, and campus updates from your fellow students
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === selectedCategory 
                  ? "bg-primary text-white shadow-md" 
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-lg text-muted-foreground">Loading articles...</div>
          </div>
        )}

        {/* News Grid */}
        {!loading && (
          <>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <div key={article.id} onClick={() => handleArticleClick(article.id)}>
                    <NewsCard
                      id={article.id}
                      title={article.title}
                      content={article.content}
                      timeAgo={getTimeAgo(article.created_at)}
                      likes={article.likes_count}
                      comments={0} // We'll update this later with actual comment counts
                      category={article.category}
                      isLiked={article.isLiked}
                      onLikeUpdate={(newLikeCount, isLiked) => handleLikeUpdate(article.id, newLikeCount, isLiked)}
                      onShare={() => handleShare(article)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-lg text-muted-foreground mb-4">
                  {selectedCategory === "All" 
                    ? "No articles available yet." 
                    : `No articles found in ${selectedCategory} category.`}
                </div>
                <button 
                  onClick={() => navigate('/submit-news')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Submit First Story
                </button>
              </div>
            )}
          </>
        )}

        {/* Submit Story Button */}
        {articles.length > 0 && (
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/submit-news')}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity"
            >
              Share Your Story
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsFeed;
