import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        console.log('Google callback params:', { token: !!token, user: !!userParam });

        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          console.log('Parsed user:', user);
          
          // Store the session
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          
          // Set the auth header
          authAPI.setAuthHeader(token);
          
          console.log('Session stored, redirecting to home...');
          
          // Small delay to ensure storage is complete
          setTimeout(() => {
            navigate('/', { replace: true });
            // Force a page reload to update the auth context
            window.location.reload();
          }, 100);
        } else {
          console.error('Missing token or user data in Google callback');
          navigate('/auth?error=missing_data', { replace: true });
        }
      } catch (error) {
        console.error('Failed to process Google callback:', error);
        navigate('/auth?error=callback_failed', { replace: true });
      } finally {
        setProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg">Completing sign in...</p>
      </div>
    </div>
  );
}
