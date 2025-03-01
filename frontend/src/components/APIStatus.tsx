import { useEffect, useState } from 'react';
import { checkAPIHealth } from '../utils/api';

export default function APIStatus() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await checkAPIHealth();
      setIsHealthy(healthy);
    };
    checkHealth();
  }, []);

  if (isHealthy === null) return null;

  return (
    <div className={`text-sm ${isHealthy ? 'text-green-500' : 'text-red-500'}`}>
      API Status: {isHealthy ? 'Connected' : 'Offline'}
    </div>
  );
}