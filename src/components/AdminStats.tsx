
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Eye, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalArticles: number;
  totalUsers: number;
  totalViews: number;
  totalLikes: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    totalUsers: 0,
    totalViews: 0,
    totalLikes: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total articles
      const { count: articlesCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total views and likes
      const { data: articlesData } = await supabase
        .from('articles')
        .select('views_count, likes_count');

      const totalViews = articlesData?.reduce((sum, article) => sum + (article.views_count || 0), 0) || 0;
      const totalLikes = articlesData?.reduce((sum, article) => sum + (article.likes_count || 0), 0) || 0;

      setStats({
        totalArticles: articlesCount || 0,
        totalUsers: usersCount || 0,
        totalViews,
        totalLikes
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalArticles}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
