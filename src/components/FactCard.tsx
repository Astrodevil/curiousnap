import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface FactCardProps {
  imageUrl: string;
  fact: string;
}

const FactCard = ({ imageUrl, fact }: FactCardProps) => {
  return (
    <Card className="w-full max-w-md overflow-hidden animate-slide-up">
      <div className="aspect-video relative">
        <img
          src={imageUrl}
          alt="Captured object"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <p className="text-lg leading-relaxed">{fact}</p>
        </div>
      </div>
    </Card>
  );
};

export default FactCard;