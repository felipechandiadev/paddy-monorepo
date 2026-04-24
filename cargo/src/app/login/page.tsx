import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

/** Compat: enlaces antiguos /login?redirect= → /?redirect= */
export default async function LoginAliasPage({ searchParams }: Props) {
  const q = await searchParams;
  const r = q.redirect?.trim();
  const target = r ? `/?redirect=${encodeURIComponent(r)}` : '/';
  redirect(target);
}
