import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const roles = ['DEO', 'Officer', 'Supervisor', 'JD']; // roles matching database enum app_role
const UserManagement = () => {
  const { toast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [committees, setCommittees] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [passwordChangeUser, setPasswordChangeUser] = useState<any | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    committee: '',
    fullCommittee: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCommittees, setLoadingCommittees] = useState(false);
  const [loadingAddUser, setLoadingAddUser] = useState(false);
  const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
  const [loadingPasswordChange, setLoadingPasswordChange] = useState(false);

  useEffect(() => {
    const fetchCommittees = async () => {
      setLoadingCommittees(true);
      try {
        const { data, error } = await supabase
          .from("committees")
          .select("code, name")
          .order("name");

        if (error) throw error;
        setCommittees(data || []);
      } catch (error) {
        toast({
          title: "Error loading committees",
          description: "Failed to load committee data. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoadingCommittees(false);
      }
    };

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data, error } = await supabase.from("profiles").select("*");
        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        toast({
          title: "Error loading users",
          description: "Failed to load users. Please refresh.",
          variant: "destructive"
        });
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchCommittees();
    fetchUsers();
  }, []);

  const validateEmail = (email: string) => {
    // Basic email regex validation
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newPassword || !confirmPassword) {
      toast({ title: "Missing fields", description: "Name, Email and Password are required", variant: "destructive" });
      return;
    }
    if (!validateEmail(newUser.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    setLoadingAddUser(true);
    try {
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newPassword,
          full_name: newUser.name,
          role: newUser.role,
          committee_id: newUser.committee,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({ title: "User creation failed", description: result.error || "Unknown error", variant: "destructive" });
        setLoadingAddUser(false);
        return;
      }

      toast({ title: "User added" });
      setUsers([...users, result.user]);
      setNewUser({ name: '', email: '', role: '', committee: '', fullCommittee: '' });
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setLoadingAddUser(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    if (!editingUser.name || !editingUser.email) {
      toast({ title: "Missing fields", description: "Name and Email are required", variant: "destructive" });
      return;
    }
    if (!validateEmail(editingUser.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    if (!window.confirm("Are you sure you want to save changes to this user?")) {
      return;
    }

    setLoadingUpdateUser(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(editingUser)
        .eq("id", editingUser.id);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "User updated" });
        setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
        setEditingUser(null);
      }
    } finally {
      setLoadingUpdateUser(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    if (!passwordChangeUser) return;

    // Password changes should be done via Supabase Auth API, not direct DB update
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        toast({ title: "Password change failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Password updated" });
        setPasswordChangeUser(null);
        setNewPassword('');
        setConfirmPassword('');
        setIsChangingPassword(false);
      }
    } catch (error: any) {
      toast({ title: "Password change failed", description: error.message || "Unknown error", variant: "destructive" });
    }
    return;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span role="img" aria-label="Add User" className="text-2xl">👤➕</span>
            Add New User
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Create new user accounts for the Kakinada District AMC system</p>
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              placeholder="Full Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="flex-1 min-w-[180px]"
            />
            <Input
              placeholder="Email Address"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="flex-1 min-w-[180px]"
            />
            <Select
              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              value={newUser.role}
              className="flex-1 min-w-[140px]"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setNewUser({ ...newUser, committee: value })}
              value={newUser.committee}
              className="flex-1 min-w-[140px]"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Committee" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {committees.map((committee) => (
                    <SelectItem key={committee.code} value={committee.code}>
                      {committee.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 min-w-[140px]"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 min-w-[140px]"
            />
            <Button onClick={handleAddUser} className="whitespace-nowrap">
              Add User
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5a9 9 0 10-15 0" />
            </svg>
            System Users - East Godavari District
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Manage existing users and their permissions across all AMCs</p>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-200 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-6 3v-3m0 0V9m0 3H6m6 0h-3" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" />
                      </svg>
                      {committees.find(c => c.code === user.committee)?.name || 'Unknown Committee'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.role === 'DEO' ? 'bg-blue-200 text-blue-800' : user.role === 'Supervisor' ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-800'}`}>
                    {user.role}
                  </span>
                  <Button size="sm" variant="outline" title="Change Password" onClick={() => {
                    setPasswordChangeUser(user);
                    setIsChangingPassword(true);
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v2m0 4h.01" />
                    </svg>
                  </Button>
                  <Button size="sm" variant="outline" title="Edit User" onClick={() => setEditingUser(user)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6m-6-6l-3 3m6-6l3-3" />
                    </svg>
                  </Button>
                  <Button size="sm" variant="outline" title="Delete User" onClick={() => alert('Delete user feature not implemented yet')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingUser && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6m-6-6l-3 3m6-6l3-3" />
              </svg>
              Edit User
            </h2>
            <Input
              placeholder="Full Name"
              value={editingUser.full_name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, full_name: e.target.value })
              }
              className="mb-2"
            />
            <Input
              placeholder="Email Address"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              className="mb-2"
            />
            <Select
              onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
              value={editingUser.role}
              className="mb-2"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setEditingUser({ ...editingUser, committee: value })}
              value={editingUser.committee}
              className="mb-2"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Committee" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {committees.map((committee) => (
                    <SelectItem key={committee.code} value={committee.code}>
                      {committee.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleUpdateUser}>Save Changes</Button>
              <Button variant="secondary" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isChangingPassword && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v2m0 4h.01" />
              </svg>
              Change Password: {passwordChangeUser?.full_name}
            </h2>
            <div className="mb-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Current Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  readOnly
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Current password for {passwordChangeUser?.full_name}</p>
            </div>
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-2"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button onClick={handlePasswordChange}>Change Password</Button>
              <Button variant="secondary" onClick={() => {
                setIsChangingPassword(false);
                setPasswordChangeUser(null);
                setNewPassword('');
                setConfirmPassword('');
              }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Add this line to export the component as default
export default UserManagement;