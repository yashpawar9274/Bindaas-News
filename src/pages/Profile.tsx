
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save, 
  BookOpen, 
  MessageSquare,
  Eye,
  Heart,
  Settings,
  Shield,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    avatar_url: ''
  });
  const [stats, setStats] = useState({
    articlesCount: 0,
    commentsCount: 0,
    totalViews: 0,
    totalLikes: 0
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserStats();
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (data) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.log('Not an admin');
    }
  };

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, bio, avatar_url, email, created_at')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Get articles count and stats
      const { data: articles, count: articlesCount } = await supabase
        .from('articles')
        .select('views_count, likes_count', { count: 'exact' })
        .eq('author_id', user.id);

      // Get comments count
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Calculate total views and likes
      const totalViews = articles?.reduce((sum, article) => sum + (article.views_count || 0), 0) || 0;
      const totalLikes = articles?.reduce((sum, article) => sum + (article.likes_count || 0), 0) || 0;

      setStats({
        articlesCount: articlesCount || 0,
        commentsCount: commentsCount || 0,
        totalViews,
        totalLikes
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          email: user.email
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Please login to view profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profile.full_name || user.email?.split('@')[0] || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  {isAdmin && (
                    <Badge variant="secondary" className="mt-2">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">
                      {profile.full_name || user.email?.split('@')[0] || 'User'}
                    </h1>
                    <Button
                      variant={editing ? "default" : "outline"}
                      onClick={() => editing ? updateProfile() : setEditing(true)}
                      disabled={loading}
                    >
                      {editing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? 'Saving...' : 'Save'}
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {editing ? (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={profile.full_name}
                          onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="avatarUrl">Avatar URL</Label>
                        <Input
                          id="avatarUrl"
                          value={profile.avatar_url}
                          onChange={(e) => setProfile(prev => ({ ...prev, avatar_url: e.target.value }))}
                          placeholder="Enter avatar image URL"
                        />
                      </div>
                    </div>
                  ) : (
                    profile.bio && (
                      <p className="mt-4 text-muted-foreground">{profile.bio}</p>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
                  <div className="text-2xl font-bold">{stats.articlesCount}</div>
                  <p className="text-sm text-muted-foreground">Articles</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-2xl font-bold">{stats.commentsCount}</div>
                  <p className="text-sm text-muted-foreground">Comments</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Eye className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Heart className="h-8 w-8 mx-auto text-red-600 mb-2" />
                  <div className="text-2xl font-bold">{stats.totalLikes}</div>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Settings and About - Now in Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/account-settings" className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-primary" />
                  <span>Account Settings</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              
              <Link to="/about" className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-primary" />
                  <span>About BindaasNews</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
