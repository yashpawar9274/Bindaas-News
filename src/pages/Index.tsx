
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsFeed from "@/components/NewsFeed";
import Footer from "@/components/Footer";
import FloatingActionButton from "@/components/FloatingActionButton";
import SignupPopup from "@/components/SignupPopup";

const Index = () => {
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  useEffect(() => {
    // Show signup popup after 1 minute (60000 milliseconds)
    const timer = setTimeout(() => {
      setShowSignupPopup(true);
    }, 60000);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <NewsFeed />
      </main>
      <Footer />
      <FloatingActionButton />
      
      <SignupPopup 
        isOpen={showSignupPopup}
        onClose={() => setShowSignupPopup(false)}
      />
    </div>
  );
};

export default Index;
