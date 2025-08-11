import { Megaphone, Instagram, Twitter, Mail, Heart } from "lucide-react";
const Footer = () => {
  return <footer className="bg-muted/30 border-t">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              <div className="font-display font-bold text-xl text-hero-text">
                Bindaas<span className="text-primary">News</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your anonymous platform for sharing the funniest, weirdest, and most entertaining moments from Theem College life.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          

          {/* Categories */}
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © 2024 BindaasNews. Made with <Heart className="h-4 w-4 inline text-red-500 fill-current" /> for Theem College
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;