import React, { useState } from 'react';
import RegisterForm from '@/components/RegisterForm';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    committee: string;
  }) => {
    setLoading(true);
    try {
      // Call your registration API endpoint here
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      toast({
        title: 'Registration Successful',
        description: 'You can now log in with your credentials.',
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return <RegisterForm onRegister={handleRegister} loading={loading} />;
};

export default Register;
