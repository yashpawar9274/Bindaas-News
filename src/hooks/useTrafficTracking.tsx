
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export const useTrafficTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const sessionId = sessionStorage.getItem('session_id') || Math.random().toString(36).substring(7);
        sessionStorage.setItem('session_id', sessionId);

        await supabase
          .from('traffic_analytics')
          .insert({
            page_path: location.pathname,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
            session_id: sessionId,
            user_id: null // Will be set by RLS if user is authenticated
          });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [location.pathname]);
};
