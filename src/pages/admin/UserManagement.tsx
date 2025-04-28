import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ApiService from '../../services/ApiService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ROLES = [
  { label: 'Officer', value: 'officer' },
  { label: 'Cashier', value: 'cashier' },
  { label: 'Manager', value: 'manager' },
];

const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'officer',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all official users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllOfficials();
      setUsers(data);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to fetch users', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ApiService.createOfficialUser(form);
      toast({ title: 'User Added', description: 'Official user registered.' });
      setForm({ fullName: '', email: '', password: '', role: 'officer' });
      fetchUsers();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to add user', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Official User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label>Full Name</label>
              <Input value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <label>Email</label>
              <Input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <label>Password</label>
              <Input type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <label>Role</label>
              <Select value={form.role} onValueChange={val => handleChange('role', val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={submitting} className="mt-2">{submitting ? 'Adding...' : 'Add User'}</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Official Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No official users found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Full Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Wallet Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b">{user.fullName}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b capitalize">{user.role}</td>
                  <td className="py-2 px-4 border-b font-mono text-xs">{user.walletAddress || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
