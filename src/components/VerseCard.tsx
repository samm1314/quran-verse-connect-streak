import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageCircle, Lightbulb } from "lucide-react";

interface Verse {
  number: number;
  surah: string;
  arabic: string;
  translation: string;
  tafsir: string;
  relevance: string;
}

interface VerseCardProps {
  verse: Verse;
}

export const VerseCard = ({ verse }: VerseCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card shadow-soft border-l-4 border-l-primary animate-fade-in">
      <div className="space-y-4">
        {/* Verse Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <Badge variant="secondary" className="bg-primary-light text-primary">
              Surah {verse.surah} - Ayah {verse.number}
            </Badge>
          </div>
        </div>

        {/* Arabic Text */}
        <div className="text-right">
          <p className="text-lg leading-loose font-arabic text-foreground" dir="rtl">
            {verse.arabic}
          </p>
        </div>

        {/* Translation */}
        <div className="bg-accent/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-accent-foreground mb-1">Translation:</p>
              <p className="text-sm text-foreground leading-relaxed italic">
                "{verse.translation}"
              </p>
            </div>
          </div>
        </div>

        {/* Tafsir */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Brief Tafsir:</p>
              <p className="text-sm text-foreground leading-relaxed">
                {verse.tafsir}
              </p>
            </div>
          </div>
        </div>

        {/* Scientific Relevance */}
        <div className="bg-gold-light/20 rounded-lg p-4 border border-gold/20">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-gradient-secondary rounded-full mt-1 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Scientific Connection:</p>
              <p className="text-sm text-foreground leading-relaxed">
                {verse.relevance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};