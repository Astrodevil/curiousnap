import React from 'react';
import { Card } from '@/components/ui/card';

interface Discovery {
  imageUrl: string;
  fact: string;
}

interface RecentDiscoveriesProps {
  discoveries: Discovery[];
}

const RecentDiscoveries = ({ discoveries }: RecentDiscoveriesProps) => {
  if (discoveries.length === 0) return null;

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Recent Discoveries</h2>
      <div className="space-y-4">
        {discoveries.map((discovery, index) => (
          <Card key={index} className="p-4 flex gap-4 animate-fade-in">
            <img
              src={discovery.imageUrl}
              alt="Recent discovery"
              className="w-20 h-20 object-cover rounded"
            />
            <p className="text-sm flex-1">{discovery.fact}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentDiscoveries;