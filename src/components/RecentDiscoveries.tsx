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
      <div className="text-center text-gray-500 p-4">
        No discoveries yet. Be the first to discover something interesting!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discoveries.map((discovery, index) => (
        <Card key={index} className="overflow-hidden animate-fade-in">
          <div className="flex gap-4 p-4">
            <img
              src={discovery.imageUrl}
              alt="Recent discovery"
              className="w-24 h-24 object-cover rounded"
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