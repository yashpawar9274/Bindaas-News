import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Upload, AlertCircle, CheckCircle, X, Image, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SubmitNews = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Campus Life",
    "Pranks & Fun", 
    "Love Stories",
    "Achievements",
    "Study Tips",
    "Breaking News"
  ];

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        return isImage || isVideo;
      });
      
      if (newFiles.length !== files.length) {
        toast({
          title: "Invalid File Type",
          description: "Please select only image or video files.",
          variant: "destructive"
        });
      }
      
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMediaFiles = async (articleId: string) => {
    const uploadPromises = mediaFiles.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${articleId}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-media')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('article-media')
        .getPublicUrl(fileName);

      // Save media info to database
      const { error: mediaError } = await supabase
        .from('article_media')
        .insert({
          article_id: articleId,
          file_url: publicUrl,
          file_type: file.type.startsWith('image/') ? 'image' : 'video',
          file_name: file.name
        });

      if (mediaError) {
        console.error('Media DB error:', mediaError);
        throw mediaError;
      }

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Insert article
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .insert({
          title,
          content,
          category,
          author_name: authorName || 'Anonymous'
        })
        .select()
        .single();

      if (articleError) throw articleError;

      // Upload media files if any
      if (mediaFiles.length > 0) {
        await uploadMediaFiles(articleData.id);
      }

      toast({
        title: "Story Submitted Successfully!",
        description: "Your story has been published and is now live on the platform.",
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setCategory("");
      setAuthorName("");
      setMediaFiles([]);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-hero-text mb-4">
              Share Your <span className="text-primary">Story</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Got something funny, interesting, or amazing to share? Tell your story with photos and videos!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Submit Your Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="title">Story Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your story a catchy title..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="authorName">Author Name (Optional)</Label>
                      <Input
                        id="authorName"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Your name (leave blank for Anonymous)"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="content">Your Story *</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell us what happened... Be detailed and engaging!"
                        className="mt-1 min-h-[200px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="media">Add Photos & Videos</Label>
                      <Input
                        id="media"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleMediaUpload}
                        className="mt-1"
                      />
                      
                      {mediaFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          {mediaFiles.map((file, index) => (
                            <div key={index} className="relative border rounded-lg p-2">
                              <div className="flex items-center gap-2">
                                {file.type.startsWith('image/') ? (
                                  <Image className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Video className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm truncate">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMediaFile(index)}
                                  className="ml-auto p-1 h-6 w-6"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div className="text-sm text-yellow-800">
                        <strong>Content Guidelines:</strong> Keep it fun, respectful, and appropriate. 
                        No hate speech, personal attacks, or inappropriate content.
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full gradient-primary hover:opacity-90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Publishing..." : "Publish Story"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Share Safely
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-sm">Upload photos and videos with your stories</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-sm">All content is stored securely</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <p className="text-sm">Stories are published instantly</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Submission Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>• Add photos and videos to make your story more engaging</p>
                  <p>• Use engaging titles that grab attention</p>
                  <p>• Include specific details to make your story vivid</p>
                  <p>• Choose the most appropriate category</p>
                  <p>• Keep it appropriate for all students</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default SubmitNews;
