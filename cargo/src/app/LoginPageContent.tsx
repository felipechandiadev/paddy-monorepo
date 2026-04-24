'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
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

    const redirectParam = searchParams.get('redirect')?.trim();
    const callbackUrl =
      redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
        ? redirectParam
        : '/weighing';

    signIn('credentials', {
      email: values.email.trim().toLowerCase(),
      password: values.password,
      callbackUrl,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md bg-background rounded-lg shadow-2xl p-8">
        {/* Logo arriba, título debajo */}
        <header className="mb-8 flex w-full flex-col items-center text-center">
          <img
            src="/logo.svg"
            alt="Paddy AyG"
            width={120}
            height={120}
            className="order-1 mb-3 h-auto w-[120px] shrink-0"
          />
          <h1 className="order-2 text-3xl font-bold text-primary">Paddy AyG</h1>
          <p className="order-3 mt-1 text-sm font-medium text-muted-foreground">
            Recepción y despacho de carga
          </p>
        </header>

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
              labelAlwaysVisible
              type="email"
              value={values.email}
              onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
              required
              name="tms_login_email"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <TextField
              id="tms-login-password"
              label="Contraseña"
              labelAlwaysVisible
              type="password"
              value={values.password}
              onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
              required
              name="tms_login_password"
              autoComplete="current-password"
              passwordVisibilityToggle
              disabled={isLoading}
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
      </div>
    </div>
  );
}
