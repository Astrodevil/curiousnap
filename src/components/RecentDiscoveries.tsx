import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb, Clock, Camera } from 'lucide-react';

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
      <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <Camera className="w-12 h-12 text-primary/60" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">No discoveries yet</h3>
            <p className="text-gray-600">Be the first to discover something interesting!</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {discoveries.map((discovery, index) => (
        <Card 
          key={index} 
          className="overflow-hidden animate-fade-in bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-md group"
        >
          <div className="flex flex-col sm:flex-row gap-6 p-5">
            <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
              <img
                src={discovery.imageUrl}
                alt="Recent discovery"
                className="w-full h-full object-cover rounded-lg shadow-sm group-hover:shadow transition-shadow duration-300"
              />
              <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full p-1.5">
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="text-gray-700 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                    {discovery.fact}
                  </p>
                  <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm text-primary/80 italic">Hover to read more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecentDiscoveries;