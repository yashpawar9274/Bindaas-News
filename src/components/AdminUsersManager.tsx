
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  role?: string;
}

const AdminUsersManager = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch users with their roles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching users:', profilesError);
      setLoading(false);
      return;
    }

    // Fetch user roles
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role');

    const usersWithRoles = profiles?.map(profile => ({
      ...profile,
      role: roles?.find(role => role.user_id === profile.id)?.role || 'user'
    })) || [];

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    const isAdmin = currentRole === 'admin';
    
    if (isAdmin) {
      // Remove admin role
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove admin role",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Admin role removed successfully"
        });
        fetchUsers();
      }
    } else {
      // Add admin role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add admin role",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Admin role added successfully"
        });
        fetchUsers();
      }
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {user.full_name || 'Anonymous User'}
                      </h3>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {getTimeAgo(user.created_at)}
                    </p>
                  </div>
                </div>
                <Button
                  variant={user.role === 'admin' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => toggleAdminRole(user.id, user.role || 'user')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </Button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUsersManager;
