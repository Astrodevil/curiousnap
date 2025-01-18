import React, { useState, useEffect } from 'react';
import CameraComponent from '@/components/Camera';
import FactCard from '@/components/FactCard';
import RecentDiscoveries from '@/components/RecentDiscoveries';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Discovery {
  imageUrl: string;
  fact: string;
}

const Index = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentDiscoveries();
  }, []);

  const fetchRecentDiscoveries = async () => {
    try {
      const { data, error } = await supabase
        .from('discoveries')
        .select('image_url, fact')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data) {
        setDiscoveries(data.map(d => ({ imageUrl: d.image_url, fact: d.fact })));
      }
    } catch (error) {
      console.error('Error fetching discoveries:', error);
      toast({
        title: "Error",
        description: "Failed to load recent discoveries.",
        variant: "destructive",
      });
    }
  };

  const handleImageCapture = async (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('analyze-image', {
        body: { image_url: imageUrl },
      });

      if (response.error) throw new Error(response.error.message);
      
      if (response.data.error) {
        toast({
          title: "Warning",
          description: response.data.error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const fact = response.data.fact;
      setCurrentFact(fact);

      // Store the discovery in Supabase
      const { error: insertError } = await supabase
        .from('discoveries')
        .insert([{ image_url: imageUrl, fact }]);

      if (insertError) throw new Error(insertError.message);

      // Refresh the recent discoveries
      await fetchRecentDiscoveries();

      toast({
        title: "Discovery Made!",
        description: "Your image has been analyzed successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Tumko Pata Hai?</h1>
          <p className="text-gray-600 mb-1">Discover fascinating facts about anything!</p>
          <a 
            href="https://studio.nebius.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            Powered by Nebius AI Studio
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <CameraComponent onImageCapture={handleImageCapture} />

            {isLoading && (
              <div className="text-center text-gray-600 animate-pulse">
                Analyzing image...
              </div>
            )}

            {currentImage && currentFact && (
              <FactCard imageUrl={currentImage} fact={currentFact} />
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Discoveries</h2>
            <RecentDiscoveries discoveries={discoveries} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;