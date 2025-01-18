import React, { useState } from 'react';
import CameraComponent from '@/components/Camera';
import FactCard from '@/components/FactCard';
import RecentDiscoveries from '@/components/RecentDiscoveries';
import { useToast } from '@/components/ui/use-toast';

interface Discovery {
  imageUrl: string;
  fact: string;
}

const Index = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const { toast } = useToast();

  const handleImageCapture = async (imageUrl: string) => {
    setCurrentImage(imageUrl);
    // Placeholder fact until we integrate Nebius API
    const placeholderFact = "This is a fascinating object! Once we add the Nebius API key, I'll tell you something really interesting about it.";
    setCurrentFact(placeholderFact);
    
    // Add to recent discoveries
    const newDiscovery = { imageUrl, fact: placeholderFact };
    setDiscoveries(prev => [newDiscovery, ...prev].slice(0, 5));
    
    toast({
      title: "New Discovery!",
      description: "Let me tell you something interesting about this...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Tumko Pata Hai?</h1>
          <p className="text-gray-600">Discover fascinating facts about anything!</p>
        </div>

        <CameraComponent onImageCapture={handleImageCapture} />

        {currentImage && currentFact && (
          <FactCard imageUrl={currentImage} fact={currentFact} />
        )}

        <RecentDiscoveries discoveries={discoveries} />
      </div>
    </div>
  );
};

export default Index;