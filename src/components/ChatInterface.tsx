import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Book, Sparkles, Search } from "lucide-react";
import { VerseCard } from "./VerseCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { WelcomeHero } from "./WelcomeHero";
import { searchQuranVerses } from "@/services/openai";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  verses?: any[];
  timestamp: Date;
}

export const ChatInterface = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startChat = () => {
    setShowWelcome(false);
    setMessages([
      {
        id: "welcome",
        type: "bot",
        content: "السلام عليكم! Welcome to QuranVerse.ai. Ask me about any scientific topic and I'll find related Quranic verses with explanations.",
        timestamp: new Date(),
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Use our OpenAI service to search for verses
      const result = await searchQuranVerses(currentInput);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: result.explanation || `I found relevant Quranic verses related to "${currentInput}". Here are the most relevant ones:`,
        verses: result.verses,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error searching verses:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "I apologize, but I encountered an error while searching for verses. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Show welcome screen initially
  if (showWelcome) {
    return <WelcomeHero onGetStarted={startChat} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                QuranVerse.ai
              </h1>
              <p className="text-sm text-muted-foreground">Discover Quranic wisdom in science</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="container mx-auto max-w-4xl py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              } animate-fade-in-up`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  message.type === "user"
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "bg-gradient-card shadow-soft"
                }`}
              >
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.verses && (
                    <div className="space-y-4 mt-4">
                      {message.verses.map((verse, index) => (
                        <VerseCard key={index} verse={verse} />
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </Card>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <Card className="p-4 bg-gradient-card shadow-soft">
                <div className="flex items-center gap-3">
                  <LoadingSpinner />
                  <p className="text-sm text-muted-foreground">
                    Searching Quranic verses...
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about any scientific topic... (e.g., 'water cycle', 'embryology', 'astronomy')"
                className="pl-10 bg-background/80 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-primary hover:bg-primary-hover shadow-medium transition-all duration-300 hover:shadow-glow hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {["Embryology", "Water Cycle", "Mountains", "Astronomy", "Oceanography"].map((topic) => (
              <Button
                key={topic}
                variant="outline"
                size="sm"
                onClick={() => setInput(topic)}
                className="text-xs bg-background/60 hover:bg-accent transition-all duration-300"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {topic}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};