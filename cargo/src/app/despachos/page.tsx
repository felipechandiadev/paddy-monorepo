import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { TmsAppLayout } from '@/components/layout/TmsAppLayout';
import { DispatchWeighingPageProvider } from '@/providers/DispatchWeighingPageProvider';
import { DespachoWeighingClient } from './ui/DespachoWeighingClient';

export default async function DespachosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?redirect=/despachos');
  }

  return (
    <DispatchWeighingPageProvider>
      <TmsAppLayout serialEnabled>
        <DespachoWeighingClient />
      </TmsAppLayout>
    </DispatchWeighingPageProvider>
  );
}
