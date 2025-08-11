import { TrendingUp, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const Hero = () => {
  const [stats, setStats] = useState({
    storiesShared: 500,
    activeStudents: 1200,
    onlineUsers: 0
  });
  useEffect(() => {
    fetchRealTimeStats();
    setupRealTimeUpdates();
  }, []);
  const fetchRealTimeStats = async () => {
    try {
      // Get total articles count
      const {
        count: articlesCount
      } = await supabase.from('articles').select('*', {
        count: 'exact',
        head: true
      });

      // Get total profiles count (active students)
      const {
        count: profilesCount
      } = await supabase.from('profiles').select('*', {
        count: 'exact',
        head: true
      });
      setStats(prev => ({
        ...prev,
        storiesShared: articlesCount || 500,
        activeStudents: profilesCount || 1200
      }));
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
    }
  };
  const setupRealTimeUpdates = () => {
    // Track online users with presence
    const channel = supabase.channel('hero-presence', {
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
      setStats(prev => ({
        ...prev,
        onlineUsers: userCount
      }));
    }).subscribe(async status => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          online_at: new Date().toISOString(),
          user_agent: navigator.userAgent
        });
      }
    });

    // Listen for new articles
    const articlesChannel = supabase.channel('hero-articles-changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'articles'
    }, () => {
      fetchRealTimeStats();
    }).subscribe();

    // Listen for new user profiles
    const profilesChannel = supabase.channel('hero-profiles-changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'profiles'
    }, () => {
      fetchRealTimeStats();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(articlesChannel);
      supabase.removeChannel(profilesChannel);
    };
  };
  return <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-primary opacity-5"></div>
      
      <div className="container px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-hero-text leading-tight mb-6 animate-fade-in-up">
            College Life
            <span className="block gradient-primary bg-clip-text text-transparent">
              Unleashed
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{
          animationDelay: '0.2s'
        }}>
            Share anonymous stories, funny moments, and campus news with your fellow Theem College students
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{
          animationDelay: '0.4s'
        }}>
            <Button size="lg" className="gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-3 pulse-glow">
              Start Reading
            </Button>
            
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{
          animationDelay: '0.6s'
        }}>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="font-display font-bold text-2xl text-hero-text">{stats.storiesShared}+</div>
              <div className="text-muted-foreground">Stories Shared</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/20 mx-auto mb-3">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div className="font-display font-bold text-2xl text-hero-text">{stats.activeStudents}+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mx-auto mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="font-display font-bold text-2xl text-hero-text">{stats.onlineUsers}</div>
              <div className="text-muted-foreground">Online Now</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;