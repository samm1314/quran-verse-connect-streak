import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Sparkles, Users, TrendingUp, MessageSquare } from "lucide-react";

interface WelcomeHeroProps {
  onGetStarted: () => void;
}

export const WelcomeHero = ({ onGetStarted }: WelcomeHeroProps) => {
  const features = [
    {
      icon: Book,
      title: "AI-Powered Verse Discovery",
      description: "Advanced AI finds relevant Quranic verses for any scientific topic"
    },
    {
      icon: MessageSquare,
      title: "Deep Tafsir Explanations", 
      description: "Get scholarly interpretations and scientific connections"
    },
    {
      icon: Users,
      title: "Community & Friends",
      description: "Connect with friends and track learning streaks together"
    },
    {
      icon: TrendingUp,
      title: "Learning Analytics",
      description: "Track your spiritual and scientific learning journey"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <Book className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                QuranVerse.ai
              </h1>
              <Badge variant="secondary" className="mt-2 bg-gold-light text-gold">
                Powered by AI
              </Badge>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Discover the beautiful connections between Quranic verses and modern science. 
            Ask any scientific question and explore relevant ayahs with detailed explanations.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-primary hover:bg-primary-hover shadow-medium hover:shadow-glow transition-all duration-300 hover:scale-105 px-8 py-3 text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Exploring
            </Button>
            <Button 
              variant="outline" 
              className="border-primary/20 hover:bg-accent transition-all duration-300 px-8 py-3 text-lg"
            >
              <Book className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border/50"
            >
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mx-auto">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Islamic Quote */}
        <Card className="mt-12 p-8 bg-gradient-card shadow-soft border-l-4 border-l-gold animate-fade-in">
          <div className="text-center space-y-4">
            <div className="text-2xl font-arabic text-foreground" dir="rtl">
              وَقُل رَّبِّ زِدْنِي عِلْمًا
            </div>
            <p className="text-muted-foreground italic">
              "And say: My Lord, increase me in knowledge" - Quran 20:114
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};