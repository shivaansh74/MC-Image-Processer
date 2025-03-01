import { useEffect, useState } from 'react';
import { checkBackendHealth } from '../utils/api';

export default function BackendStatus() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthy = await checkBackendHealth();
        setIsHealthy(healthy);
      } catch (error) {
        setIsHealthy(false);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Checking backend status...</div>;

  return (
    <div className={`p-2 rounded-md ${isHealthy ? 'bg-green-100' : 'bg-red-100'}`}>
      Backend Status: {isHealthy ? 'Connected' : 'Unavailable'}
    </div>
  );
}