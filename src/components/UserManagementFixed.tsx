import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const roles = ['DEO', 'Admin', 'Viewer']; // example roles
const committeesList = [
  'Tuni AMC',
  'Another Committee',
  // Add more committees or fetch dynamically if needed
];

const UserManagement = () => {
  const { toast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [committees, setCommittees] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [passwordChangeUser, setPasswordChangeUser] = useState<any | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'DEO',
    committee: 'Tuni AMC',
    fullCommittee: 'Tuni Agricultural Market Committee',
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
    if (!newUser.name || !newUser.email) {
      toast({ title: "Missing fields", description: "Name and Email are required", variant: "destructive" });
      return;
    }
    if (!validateEmail(newUser.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    setLoadingAddUser(true);
    try {
      const { data, error } = await supabase.from("profiles").insert([newUser]);

      if (error) {
        toast({ title: "Add failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "User added" });
        setUsers([...users, ...(data || [])]);
        setNewUser({ name: '', email: '', role: 'DEO', committee: 'Tuni AMC', fullCommittee: 'Tuni Agricultural Market Committee' });
      }
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
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Add New User</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Input
              placeholder="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            />
            <Input
              placeholder="Committee"
              value={newUser.committee}
              onChange={(e) => setNewUser({ ...newUser, committee: e.target.value })}
            />
          </div>
          <Button onClick={handleAddUser}>Add User</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">User List</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => setEditingUser(user)}>Edit</Button>
                  <Button size="sm" onClick={() => {
                    setPasswordChangeUser(user);
                    setIsChangingPassword(true);
                  }}>Change Password</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {editingUser && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Edit User</h2>
            <Input
              placeholder="Name"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />
            <Button onClick={handleUpdateUser}>Save Changes</Button>
            <Button variant="secondary" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {isChangingPassword && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </div>
            </div>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="space-x-2">
              <Button onClick={handlePasswordChange}>Change</Button>
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