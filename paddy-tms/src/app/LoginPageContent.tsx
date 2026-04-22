'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import { Button } from '@/shared/components/ui/Button/Button';
import Alert from '@/shared/components/ui/Alert/Alert';
import { validateEmail } from '@/features/logistics/utils/validation';

interface LoginValues {
  email: string;
  password: string;
}

const initialValues: LoginValues = {
  email: '',
  password: '',
};

export default function LoginPageContent() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!values.email || !validateEmail(values.email)) {
      setSubmitError('Por favor ingresa un email válido');
      return;
    }

    if (!values.password) {
      setSubmitError('Por favor ingresa tu contraseña');
      return;
    }

    setIsLoading(true);
    
    // Instead of waiting for signIn to return, just submit and let NextAuth handle everything
    // The form will redirect automatically via NextAuth's built-in redirect
    signIn('credentials', {
      email: values.email.trim().toLowerCase(),
      password: values.password,
      callbackUrl: '/weighing',
    });
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
              onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
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
              onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
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
            <span className="font-medium">Email:</span> pojeda@ayg.cl
          </p>
          <p className="text-xs text-foreground">
            <span className="font-medium">Contraseña:</span> pass
          </p>
        </div>
      </div>
    </div>
  );
}
