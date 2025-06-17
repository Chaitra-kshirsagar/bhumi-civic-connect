
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, AlertCircle } from 'lucide-react';

// Mock Firebase auth and firestore - replace with actual Firebase imports
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate auth check with super admin user
    setTimeout(() => {
      setUser({ 
        uid: 'super-admin-123', 
        email: 'superadmin@example.com',
        role: 'super-admin' 
      });
      setLoading(false);
    }, 1000);
  }, []);
  
  return { user, loading };
};

interface User {
  id: string;
  name: string;
  email: string;
  role: 'volunteer' | 'admin' | 'super-admin';
}

const SuperAdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      // Check if user is super admin
      if (!user || user.role !== 'super-admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }
      
      fetchUsers();
    }
  }, [user, authLoading, navigate, toast]);

  const fetchUsers = async () => {
    try {
      // Mock Firestore query - replace with actual Firebase query
      // const usersRef = collection(db, 'users');
      // const snapshot = await getDocs(usersRef);
      // const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Mock user data
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'volunteer'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin'
        },
        {
          id: '3',
          name: 'Bob Wilson',
          email: 'bob@example.com',
          role: 'volunteer'
        },
        {
          id: '4',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'admin'
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'volunteer' | 'admin') => {
    setUpdating(userId);
    
    try {
      // Mock Firestore update - replace with actual Firebase update
      // const userRef = doc(db, 'users', userId);
      // await updateDoc(userRef, { role: newRole });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      const user = users.find(u => u.id === userId);
      toast({
        title: "Role Updated",
        description: `${user?.name}'s role has been updated to ${newRole === 'admin' ? 'Event Admin' : 'Volunteer'}.`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-[#43A047] text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'super-admin') {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-500 mb-4">
              You don't have permission to access this page.
            </p>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#43A047] hover:bg-[#43A047]/90"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-[#43A047]" />
          <h1 className="text-3xl font-bold text-[#43A047]">User Role Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#43A047]">
              <Users className="h-5 w-5" />
              Manage User Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found.</p>
                <Button 
                  onClick={fetchUsers}
                  className="mt-4 bg-[#43A047] hover:bg-[#43A047]/90"
                >
                  Refresh
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Event Admin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-[#F9A825]/20 text-[#F9A825]' 
                            : user.role === 'super-admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-[#43A047]/20 text-[#43A047]'
                        }`}>
                          {user.role === 'admin' ? 'Event Admin' : 
                           user.role === 'super-admin' ? 'Super Admin' : 'Volunteer'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.role === 'super-admin' ? (
                          <span className="text-gray-500 text-sm">Protected</span>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`role-${user.id}`}
                              checked={user.role === 'admin'}
                              onCheckedChange={(checked) => 
                                updateUserRole(user.id, checked ? 'admin' : 'volunteer')
                              }
                              disabled={updating === user.id}
                            />
                            <Label 
                              htmlFor={`role-${user.id}`}
                              className="text-sm text-gray-600"
                            >
                              {updating === user.id ? 'Updating...' : 
                               user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </Label>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminPage;
