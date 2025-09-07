import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function GoogleLoginCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const user = JSON.parse(searchParams.get('user'));
    const role = user.role;

    if (token && user) {
      login(user, token);
      navigate(role === 'admin' ? '/admin' : '/customer');
    } else {
      navigate('/login');
    }
  }, [location, navigate, login]);

  return <div>Loading...</div>;
}
