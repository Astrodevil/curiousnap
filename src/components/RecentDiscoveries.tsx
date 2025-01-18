import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface Discovery {
  imageUrl: string;
  fact: string;
}

interface RecentDiscoveriesProps {
  discoveries: Discovery[];
}

const RecentDiscoveries = ({ discoveries }: RecentDiscoveriesProps) => {
  if (discoveries.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-500 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Lightbulb className="w-8 h-8 text-gray-400" />
          <p>No discoveries yet. Be the first to discover something interesting!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {discoveries.map((discovery, index) => (
        <Card 
          key={index} 
          className="overflow-hidden animate-fade-in bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors duration-300"
        >
          <div className="flex gap-4 p-4">
            <img
              src={discovery.imageUrl}
              alt="Recent discovery"
              className="w-24 h-24 object-cover rounded shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-700 line-clamp-4">{discovery.fact}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecentDiscoveries;