'use client'

import { useEffect } from 'react';

export default function EnvTest() {
  useEffect(() => {
    console.log('🔍 ENVIRONMENT VARIABLE TEST');
    console.log('NEXT_PUBLIC_SHOTSTACK_SANDBOX_API_KEY:', process.env.NEXT_PUBLIC_SHOTSTACK_SANDBOX_API_KEY);
    console.log('NEXT_PUBLIC_SHOTSTACK_PRODUCTION_API_KEY:', process.env.NEXT_PUBLIC_SHOTSTACK_PRODUCTION_API_KEY);
    console.log('NEXT_PUBLIC_ANTHROPIC_API_KEY:', process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY);
    console.log('All NEXT_PUBLIC vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
      <p>Check the browser console for environment variable values.</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p><strong>NEXT_PUBLIC_SHOTSTACK_SANDBOX_API_KEY:</strong> {process.env.NEXT_PUBLIC_SHOTSTACK_SANDBOX_API_KEY ? 'SET' : 'UNDEFINED'}</p>
        <p><strong>NEXT_PUBLIC_SHOTSTACK_PRODUCTION_API_KEY:</strong> {process.env.NEXT_PUBLIC_SHOTSTACK_PRODUCTION_API_KEY ? 'SET' : 'UNDEFINED'}</p>
        <p><strong>NEXT_PUBLIC_ANTHROPIC_API_KEY:</strong> {process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ? 'SET' : 'UNDEFINED'}</p>
      </div>
    </div>
  );
}