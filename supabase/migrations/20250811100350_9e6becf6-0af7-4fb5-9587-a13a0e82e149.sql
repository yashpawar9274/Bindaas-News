
-- Add view tracking functionality and insert mock articles
-- First, let's add some columns if they don't exist and create article likes table
CREATE TABLE IF NOT EXISTS public.article_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable RLS on article_likes
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for article_likes
CREATE POLICY "Anyone can view article likes" ON public.article_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like articles" ON public.article_likes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can unlike their own likes" ON public.article_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Insert mock Hindi and English articles
INSERT INTO public.articles (title, content, category, author_name, likes_count, views_count) VALUES
('कॉलेज में नया कैंटीन खुला', 'हमारे कॉलेज में एक नया कैंटीन खुला है जो बहुत ही स्वादिष्ट खाना परोसता है। यहाँ पर उत्तर भारतीय, दक्षिण भारतीय और चाइनीज खाना मिलता है। कैंटीन की सजावट भी बहुत सुंदर है और यहाँ बैठने की व्यवस्था भी अच्छी है। सभी छात्रों को इस नए कैंटीन का बहुत इंतज़ार था।', 'Campus Life', 'राहुल शर्मा', 45, 120),

('College Fest 2024 - The Biggest Event Ever!', 'Get ready for the most spectacular college fest of 2024! This year we have amazing performances, competitions, food stalls, and celebrity guests. The fest will run for 3 days with different themes each day. Day 1 is Cultural Night, Day 2 is Sports Day, and Day 3 is the Grand Finale with DJ night.', 'Campus Life', 'Priya Patel', 78, 200),

('छात्रावास में वाई-फाई की समस्या', 'कल से छात्रावास में वाई-फाई की गति बहुत धीमी हो गई है। कई छात्र अपने ऑनलाइन क्लासेस attend नहीं कर पा रहे हैं। हमने वार्डन से शिकायत की है और उम्मीद है कि जल्दी ही यह समस्या हल हो जाएगी। अभी के लिए library का वाई-फाई इस्तेमाल कर सकते हैं।', 'Breaking News', 'अनिल कुमार', 23, 85),

('Epic Prank in Computer Lab Goes Viral', 'A group of final year students pulled off the most hilarious prank in the computer lab yesterday. They changed all the desktop wallpapers to funny memes of professors and even created fake error messages. The prank was so good that even the professors couldn''t help but laugh. Video of the prank has already got 10k views on social media!', 'Pranks & Fun', 'Arjun Singh', 156, 450),

('प्रेम कहानी: लाइब्रेरी में मिला प्यार', 'यह है राज और सुमित्रा की प्यारी सी कहानी। दोनों रोज़ library में पढ़ने आते थे और एक दिन राज ने सुमित्रा की किताब गिरते देखी। उसने मदद की और बात शुरू हुई। अब 6 महीने बाद दोनों साथ में पढ़ते हैं और जल्दी ही शादी करने वाले हैं। Love story goals!', 'Love Stories', 'रोहित वर्मा', 89, 275),

('Study Tips: How to Score 90+ in Exams', 'As exam season approaches, here are some proven study tips that helped me score 92% last semester. 1) Make a study schedule 2) Take notes by hand 3) Form study groups 4) Take regular breaks 5) Practice previous year papers 6) Stay healthy and sleep well. These simple tips can make a huge difference in your grades!', 'Study Tips', 'Neha Agarwal', 67, 180),

('कॉलेज टीम ने जीता राज्य स्तरीय फुटबॉल टूर्नामेंट', 'हमारी कॉलेज फुटबॉल टीम ने राज्य स्तरीय टूर्नामेंट में पहला स्थान हासिल किया है। यह एक बहुत बड़ी उपलब्धि है क्योंकि 50 से ज्यादा कॉलेज इस टूर्नामेंट में भाग ले रहे थे। टीम के कप्तान विकास ने कहा कि यह जीत सभी की मेहनत का नतीजा है।', 'Achievements', 'सुरेश पाटिल', 134, 320),

('Hostel Food Review: Week 3 Menu Analysis', 'This week''s hostel mess menu was quite good compared to previous weeks. Monday dal-rice combo was perfect, Tuesday''s rajma was amazing, but Wednesday''s sabzi was a bit bland. The best meal was Friday''s chicken curry which was absolutely delicious. Overall rating: 7.5/10. Mess committee is definitely improving!', 'Campus Life', 'Karan Malhotra', 41, 95);

-- Add some views to existing articles to make it more realistic
UPDATE public.articles SET views_count = views_count + FLOOR(RANDOM() * 100 + 50) WHERE views_count IS NULL OR views_count = 0;
UPDATE public.articles SET likes_count = FLOOR(RANDOM() * 200 + 10) WHERE likes_count IS NULL OR likes_count = 0;
