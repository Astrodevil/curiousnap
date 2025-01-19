import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb, Camera } from 'lucide-react';

interface FactCardProps {
  imageUrl: string;
  fact: string;
}

const FactCard = ({ imageUrl, fact }: FactCardProps) => {
  return (
    <Card className="w-full overflow-hidden animate-slide-up bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10">
      <div className="relative">
        <div className="aspect-video md:aspect-[16/9] lg:aspect-[2/1] relative">
          <img
            src={imageUrl}
            alt="Captured object"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full p-2">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8 bg-gradient-to-b from-white/80 to-white">
        <div className="flex items-start gap-4">
          <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <p className="text-lg md:text-xl leading-relaxed text-gray-700">{fact}</p>
        </div>
      </div>
    </Card>
  );
};

export default FactCard;