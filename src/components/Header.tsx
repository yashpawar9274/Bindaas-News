
import { Megaphone, Plus, Menu, User, Shield, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "./AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (data) {
        setIsAdmin(true);
      }
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleSubmitNewsClick = () => {
    if (!user) {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
              <Megaphone className="h-6 w-6 text-white" />
            </div>
            <div className="font-display font-bold text-xl text-hero-text">
              Bindaas<span className="text-primary">News</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-foreground hover:text-primary transition-colors font-medium ${
                isActive('/') ? 'text-primary' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/categories" 
              className={`text-foreground hover:text-primary transition-colors font-medium ${
                isActive('/categories') ? 'text-primary' : ''
              }`}
            >
              Categories
            </Link>
            {/* Admin Dashboard - Only show if user is admin */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1 ${
                  isActive('/admin') ? 'text-primary' : ''
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Right side - Submit News and User Profile */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/submit-news">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="hidden sm:flex gradient-primary hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Submit News
                  </Button>
                </Link>
                <Link to="/profile">
                  <div className="flex items-center gap-2 hover:bg-muted p-2 rounded-lg transition-colors">
                    <UserCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-foreground hidden sm:block">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </div>
                </Link>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="hidden sm:flex gradient-primary hover:opacity-90 transition-opacity"
                onClick={handleSubmitNewsClick}
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit News
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="container py-4 space-y-3">
              <Link 
                to="/" 
                className={`block py-2 text-foreground hover:text-primary transition-colors font-medium ${
                  isActive('/') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/categories" 
                className={`block py-2 text-foreground hover:text-primary transition-colors font-medium ${
                  isActive('/categories') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              {/* Admin Dashboard - Mobile */}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`block py-2 text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1 ${
                    isActive('/admin') ? 'text-primary' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mb-2"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Link to="/submit-news" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full gradient-primary hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Submit News
                    </Button>
                  </Link>
                </>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full gradient-primary hover:opacity-90 transition-opacity"
                  onClick={() => {
                    handleSubmitNewsClick();
                    setIsMenuOpen(false);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit News
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Header;
