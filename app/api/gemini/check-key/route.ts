'use server';

import { cookies } from 'next/headers';

export async function GET() {
  const geminiKey = cookies().get('GEMINI_API_KEY')?.value;
  return new Response(JSON.stringify({ hasKey: !!geminiKey }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
