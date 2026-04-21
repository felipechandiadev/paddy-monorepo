'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLogistics } from '@/features/logistics/hooks/useLogistics';
import { login } from '@/features/logistics/services/authService';
import { validateEmail, validatePassword } from '@/features/logistics/utils/validation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setError } = useLogistics();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/weighing';

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      setUser(user);
      setError(null);
      router.push(redirect);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setErrors({ submit: message });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Paddy TMS</h1>
          <p className="text-center text-gray-600 mb-8">Truck Management System</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`
                  w-full px-4 py-2 border rounded-lg text-sm
                  ${errors.email ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
                placeholder="admin@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`
                  w-full px-4 py-2 border rounded-lg text-sm
                  ${errors.password ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium
                hover:bg-blue-700 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                mt-6
              "
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Email: admin@example.com</p>
            <p>Password: Demo12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}
