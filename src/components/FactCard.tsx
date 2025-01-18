import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb, Camera } from 'lucide-react';

interface FactCardProps {
  imageUrl: string;
  fact: string;
}

const FactCard = ({ imageUrl, fact }: FactCardProps) => {
  return (
    <Card className="w-full overflow-hidden animate-slide-up bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative">
        <div className="aspect-video md:aspect-[16/9] lg:aspect-[2/1] relative">
          <img
            src={imageUrl}
            alt="Captured object"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Camera className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4">
          <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <p className="text-lg md:text-xl leading-relaxed text-gray-700">{fact}</p>
        </div>
      </div>
    </Card>
  );
};

export default FactCard;