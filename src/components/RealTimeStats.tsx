import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, BookOpen, Eye } from 'lucide-react';
const RealTimeStats = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [storyCount, setStoryCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  useEffect(() => {
    // Track this user as online
    const channel = supabase.channel('website-visitors', {
      config: {
        presence: {
          key: Math.random().toString(36).substring(7)
        }
      }
    });
    channel.on('presence', {
      event: 'sync'
    }, () => {
      const presenceState = channel.presenceState();
      const userCount = Object.keys(presenceState).length;
      setOnlineUsers(userCount);
    }).on('presence', {
      event: 'join'
    }, ({
      newPresences
    }) => {
      console.log('New users joined:', newPresences);
    }).on('presence', {
      event: 'leave'
    }, ({
      leftPresences
    }) => {
      console.log('Users left:', leftPresences);
    }).subscribe(async status => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          online_at: new Date().toISOString(),
          user_agent: navigator.userAgent
        });
      }
    });

    // Listen for new articles in real-time
    const articlesChannel = supabase.channel('articles-changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'articles'
    }, payload => {
      console.log('New article:', payload);
      fetchStoryCount();
    }).subscribe();

    // Initial data fetch
    fetchStoryCount();

    // Increment visitor count
    setVisitorCount(prev => prev + 1);
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(articlesChannel);
    };
  }, []);
  const fetchStoryCount = async () => {
    const {
      count
    } = await supabase.from('articles').select('*', {
      count: 'exact',
      head: true
    });
    if (count) setStoryCount(count);
  };
  return <div className="fixed bottom-4 left-4 z-50">
      
    </div>;
};
export default RealTimeStats;