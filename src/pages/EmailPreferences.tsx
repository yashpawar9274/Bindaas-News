
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Bell, BookOpen, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const EmailPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    newArticles: true,
    comments: true,
    likes: false,
    newsletter: true,
    adminUpdates: false,
    securityAlerts: true,
    weeklyDigest: true,
    breaking: true
  });

  const handleEmailSettingChange = (key: string, value: boolean) => {
    setEmailSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Email Preference Updated",
      description: "Your email notification preference has been updated.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Please login to view email preferences</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link to="/account-settings" className="flex items-center gap-2 text-primary hover:underline mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Account Settings
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Email Preferences</h1>
            <p className="text-muted-foreground">Manage your email notifications and subscriptions</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Article Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Articles</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new articles are published</p>
                  </div>
                  <Switch
                    checked={emailSettings.newArticles}
                    onCheckedChange={(checked) => handleEmailSettingChange('newArticles', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Breaking News</Label>
                    <p className="text-sm text-muted-foreground">Immediate alerts for breaking news stories</p>
                  </div>
                  <Switch
                    checked={emailSettings.breaking}
                    onCheckedChange={(checked) => handleEmailSettingChange('breaking', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Interaction Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comments</Label>
                    <p className="text-sm text-muted-foreground">When someone comments on your articles</p>
                  </div>
                  <Switch
                    checked={emailSettings.comments}
                    onCheckedChange={(checked) => handleEmailSettingChange('comments', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Likes</Label>
                    <p className="text-sm text-muted-foreground">When someone likes your articles</p>
                  </div>
                  <Switch
                    checked={emailSettings.likes}
                    onCheckedChange={(checked) => handleEmailSettingChange('likes', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Newsletter & Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter</Label>
                    <p className="text-sm text-muted-foreground">Weekly newsletter with top stories</p>
                  </div>
                  <Switch
                    checked={emailSettings.newsletter}
                    onCheckedChange={(checked) => handleEmailSettingChange('newsletter', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Summary of the week's most popular articles</p>
                  </div>
                  <Switch
                    checked={emailSettings.weeklyDigest}
                    onCheckedChange={(checked) => handleEmailSettingChange('weeklyDigest', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Admin Updates</Label>
                    <p className="text-sm text-muted-foreground">Important announcements from the team</p>
                  </div>
                  <Switch
                    checked={emailSettings.adminUpdates}
                    onCheckedChange={(checked) => handleEmailSettingChange('adminUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Important security notifications (recommended)</p>
                  </div>
                  <Switch
                    checked={emailSettings.securityAlerts}
                    onCheckedChange={(checked) => handleEmailSettingChange('securityAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreferences;
