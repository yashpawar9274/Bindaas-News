
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

const AutoLoginPopup = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) return; // Don't show popup if user is already logged in

    const showPopupInterval = setInterval(() => {
      setShowModal(true);
    }, 15000); // Show every 15 seconds instead of 60

    return () => clearInterval(showPopupInterval);
  }, [user]);

  if (user) return null;

  return (
    <AuthModal 
      isOpen={showModal} 
      onClose={() => setShowModal(false)} 
    />
  );
};

export default AutoLoginPopup;
