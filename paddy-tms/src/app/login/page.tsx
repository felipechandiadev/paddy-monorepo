'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLogistics } from '@/features/logistics/hooks/useLogistics';
import { login } from '@/features/logistics/services/authService';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import { validateEmail, validatePassword } from '@/features/logistics/utils/validation';

interface LoginValues {
  email: string;
  password: string;
}

const initialValues: LoginValues = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setError: setContextError } = useLogistics();
  
  const [values, setValues] = useState<LoginValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const redirect = searchParams.get('redirect') || '/weighing';

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!values.email || !validateEmail(values.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!values.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(values.email, values.password);
      setUser(user);
      setContextError(null);
      router.push(redirect);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setSubmitError(message);
      setContextError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md bg-background rounded-lg shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Paddy TMS</h1>
          <p className="text-sm text-foreground font-medium">Truck Management System</p>
        </div>

        {/* Subtitle */}
        <div className="subtitle text-center p-1 pt-0 w-full mb-4 leading-snug">
          Ingresa tus credenciales
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {submitError && (
            <Alert variant="error" className="mb-4">
              {submitError}
            </Alert>
          )}

          {/* Email Field */}
          <div className="form-group">
            <TextField
              id="tms-login-email"
              label="Email"
              type="email"
              value={values.email}
              onChange={(event) => {
                setValues((prev) => ({ ...prev, email: event.target.value }));
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: '' }));
                }
              }}
              error={!!errors.email}
              helperText={errors.email}
              required
              name="tms_login_email"
              autoComplete="email"
              disabled={isLoading}
              placeholder="operator@paddy.com"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <TextField
              id="tms-login-password"
              label="Contraseña"
              type="password"
              value={values.password}
              onChange={(event) => {
                setValues((prev) => ({ ...prev, password: event.target.value }));
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: '' }));
                }
              }}
              error={!!errors.password}
              helperText={errors.password}
              required
              name="tms_login_password"
              autoComplete="current-password"
              passwordVisibilityToggle
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full mt-8">
            <Button 
              variant="primary" 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-neutral rounded-lg border border-border">
          <p className="text-xs font-semibold text-primary mb-2">Credenciales de Prueba:</p>
          <p className="text-xs text-foreground mb-1">
            <span className="font-medium">Email:</span> operator@paddy.com
          </p>
          <p className="text-xs text-foreground">
            <span className="font-medium">Contraseña:</span> Operator123!
          </p>
        </div>
      </div>
    </div>
  );
}
