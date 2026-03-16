// Keep-alive utility to prevent Render backend from sleeping
const PING_INTERVAL = 30000; // 30 seconds

export function startKeepAlive() {
  const backendUrl = import.meta.env.VITE_API_URL || 'https://phishguard-backend-26g7.onrender.com/api';
  
  // Function to ping the backend
  const ping = async () => {
    try {
      const response = await fetch(`${backendUrl}/ping`);
      if (response.ok) {
        console.log('[KeepAlive] Backend ping successful');
      } else {
        console.warn('[KeepAlive] Backend ping failed with status:', response.status);
      }
    } catch (error) {
      console.error('[KeepAlive] Backend ping error:', error.message);
    }
  };

  // Ping immediately on start
  ping();

  // Then ping every 30 seconds
  setInterval(ping, PING_INTERVAL);
  
  console.log('[KeepAlive] Started - pinging backend every 30 seconds');
}
