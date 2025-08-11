
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Shield, 
  Mail, 
  Bell, 
  Eye, 
  Lock,
  LogOut,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/Header';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Please login to view settings</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and settings</p>
          </div>

          {/* Settings Menu */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Link to="/privacy-settings" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Privacy Settings</h3>
                      <p className="text-sm text-muted-foreground">Control your privacy and data preferences</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                
                <Separator />
                
                <Link to="/email-preferences" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">Email Preferences</h3>
                      <p className="text-sm text-muted-foreground">Manage email notifications and subscriptions</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Separator />
                
                <Link to="/about" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">About</h3>
                      <p className="text-sm text-muted-foreground">Learn more about BindaasNews</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>

            {/* Logout Section */}
            <Card>
              <CardContent className="p-4">
                <Button 
                  variant="destructive" 
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {loading ? 'Logging out...' : 'Logout'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
