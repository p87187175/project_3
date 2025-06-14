import React, { useEffect, useState } from 'react';
import { testConnection } from '../lib/supabase';

export default function ConnectionTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testConnection();
        setStatus(result ? 'success' : 'error');
        setMessage(result ? 'All connections successful!' : 'Connection test failed');
      } catch (error) {
        setStatus('error');
        setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 rounded-lg border">
      <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
      <div className={`p-2 rounded ${
        status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
        status === 'success' ? 'bg-green-100 text-green-800' :
        'bg-red-100 text-red-800'
      }`}>
        {status === 'loading' ? 'Testing connections...' : message}
      </div>
    </div>
  );
} 