
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Heart, Zap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "100% Anonymous",
      description: "Share your stories without revealing your identity. We protect your privacy."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Driven",
      description: "Built by students, for students. Every story comes from our Theem College family."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Positive Vibes",
      description: "We focus on fun, laughter, and positive college experiences."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real Stories",
      description: "Authentic moments from real students living the college life."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-hero-text mb-6">
            About <span className="text-primary">BindaasNews</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            BindaasNews is Theem College's premier platform for sharing anonymous stories, 
            funny moments, pranks, and everything that makes our college life amazing. 
            We believe every student has a story worth telling.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="gradient-primary text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-display font-bold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed max-w-2xl mx-auto">
                To create a safe, fun, and engaging platform where Theem College students can 
                anonymously share their experiences, connect with peers, and celebrate the 
                vibrant culture of our college community.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-center text-hero-text mb-12">
            Why Choose BindaasNews?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-primary mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2 text-hero-text">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-display font-bold text-primary mb-2">500+</h3>
              <p className="text-muted-foreground">Stories Shared</p>
            </div>
            <div>
              <h3 className="text-4xl font-display font-bold text-primary mb-2">1000+</h3>
              <p className="text-muted-foreground">Active Students</p>
            </div>
            <div>
              <h3 className="text-4xl font-display font-bold text-primary mb-2">24/7</h3>
              <p className="text-muted-foreground">Community Support</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <Card className="bg-card-background">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-display font-bold mb-4 text-hero-text">Get in Touch</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Have questions, suggestions, or want to report inappropriate content? 
              We're here to help make BindaasNews better for everyone.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Email: support@bindaasnews.com
              </p>
              <p className="text-sm text-muted-foreground">
                Follow us on social media for updates and announcements
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default About;
