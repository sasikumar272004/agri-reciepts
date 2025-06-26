import React, { useState, useEffect } from 'react';

interface RegisterFormProps {
  onRegister: (formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    committee: string;
  }) => void;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, loading }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('DEO');
  const [committee, setCommittee] = useState('');
  const [committees, setCommittees] = useState<string[]>([]);

  useEffect(() => {
    // Fetch committees from API or static list
    // For now, use static list
    setCommittees(['Kakinada AMC', 'Tuni AMC']);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onRegister({ username, email, password, confirmPassword, role, committee });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="DEO">DEO</option>
          <option value="Supervisor">Supervisor</option>
          <option value="JD">JD</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="committee" className="block text-gray-700 font-semibold mb-2">
          Committee
        </label>
        <select
          id="committee"
          value={committee}
          onChange={e => setCommittee(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          required={role !== 'JD'}
        >
          <option value="">Select Committee</option>
          {committees.map((cmt, idx) => (
            <option key={idx} value={cmt}>
              {cmt}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>
      <div className="flex items-center justify-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
