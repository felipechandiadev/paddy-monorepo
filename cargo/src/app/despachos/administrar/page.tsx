import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { TmsAppLayout } from '@/components/layout/TmsAppLayout';

export default async function DespachosAdministrarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?redirect=/despachos/administrar');
  }

  return (
    <TmsAppLayout>
      <main className="flex-1 p-6" />
    </TmsAppLayout>
  );
}
