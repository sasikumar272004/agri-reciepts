import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Search, FileText, Users, Shield } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import { useToast } from "@/components/hooks/use-toast";
import LoginForm from "@/components/LoginForm";

const LOCAL_STORAGE_USER_KEY = 'currentUser';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      const data = await response.json();
      setCurrentUser(data.user);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({ ...data.user, token: data.token }));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.full_name || data.user.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || 'Invalid username or password',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AMC Receipt System</h1>
                  <p className="text-sm text-gray-600">Agricultural Market Committee Management</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Digital Receipt Management, Simplified.
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Secure, efficient, and transparent management of agricultural market committee trade receipts.
              </p>
              <div className="space-y-4">
                  <div className="flex items-start gap-4"><FileText className="h-6 w-6 text-blue-600 mt-1 shrink-0" /><p><strong>Receipt Entry & Validation:</strong> Digital entry of trade receipts with instant validation.</p></div>
                  <div className="flex items-start gap-4"><Search className="h-6 w-6 text-green-600 mt-1 shrink-0" /><p><strong>Analytics & Insights:</strong> Comprehensive analytics and trader performance tracking.</p></div>
                  <div className="flex items-start gap-4"><Users className="h-6 w-6 text-purple-600 mt-1 shrink-0" /><p><strong>Role-Based Access:</strong> Secure access for DEOs, Supervisors, and Directors.</p></div>
                  <div className="flex items-start gap-4"><Shield className="h-6 w-6 text-red-600 mt-1 shrink-0" /><p><strong>User Management:</strong> Complete system administration and role management.</p></div>
              </div>

              {/* Demo Credentials Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Demo Login Credentials</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>DEO (Tuni AMC):</strong> demo_deo</p>
                  <p><strong>Supervisor (Kakinada AMC):</strong> demo_supervisor</p>
                  <p><strong>Joint Director:</strong> demo_jd</p>
                </div>
                <p className="text-xs text-blue-600 mt-2">Use these usernames to login (password not required for demo).</p>
              </div>
            </div>
            <div className="flex justify-center flex-col items-center gap-4">
              <LoginForm onLogin={handleLogin} loading={loading} />
              <a href="/register" className="text-blue-600 hover:underline text-sm">
                Don't have an account? Register here
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} />;
};

export default Index;
