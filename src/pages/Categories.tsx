
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Zap, Heart, Trophy, Book } from "lucide-react";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Campus Life",
      icon: <Users className="h-6 w-6" />,
      description: "Daily happenings around campus",
      count: 42,
      color: "bg-orange-100 text-orange-700 border-orange-200"
    },
    {
      id: 2,
      name: "Pranks & Fun",
      icon: <Zap className="h-6 w-6" />,
      description: "Hilarious pranks and funny moments",
      count: 28,
      color: "bg-purple-100 text-purple-700 border-purple-200"
    },
    {
      id: 3,
      name: "Love Stories",
      icon: <Heart className="h-6 w-6" />,
      description: "Anonymous romantic confessions",
      count: 15,
      color: "bg-pink-100 text-pink-700 border-pink-200"
    },
    {
      id: 4,
      name: "Achievements",
      icon: <Trophy className="h-6 w-6" />,
      description: "Student accomplishments & wins",
      count: 23,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200"
    },
    {
      id: 5,
      name: "Study Tips",
      icon: <Book className="h-6 w-6" />,
      description: "Academic hacks and resources",
      count: 31,
      color: "bg-blue-100 text-blue-700 border-blue-200"
    },
    {
      id: 6,
      name: "Breaking News",
      icon: <Clock className="h-6 w-6" />,
      description: "Latest updates from Theem College",
      count: 12,
      color: "bg-green-100 text-green-700 border-green-200"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-hero-text mb-4">
            Explore <span className="text-primary">Categories</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest stories from different aspects of college life at Theem College
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-xl ${category.color}`}>
                    {category.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count} stories
                  </Badge>
                </div>
                <CardTitle className="text-xl font-display group-hover:text-primary transition-colors">
                  {category.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Updated daily
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
