import React, { useState, useEffect } from 'react';
import CameraComponent from '@/components/Camera';
import FactCard from '@/components/FactCard';
import RecentDiscoveries from '@/components/RecentDiscoveries';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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

      const { error: insertError } = await supabase
        .from('discoveries')
        .insert([{ image_url: imageUrl, fact }]);

      if (insertError) throw new Error(insertError.message);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary mb-2 animate-fade-in">Tumko Pata Hai?</h1>
          <p className="text-gray-600 text-lg mb-1">Discover fascinating facts about anything!</p>
          <a 
            href="https://studio.nebius.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-primary hover:text-primary/80 transition-colors underline decoration-dotted"
          >
            Powered by Nebius AI Studio
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="p-6 space-y-6 shadow-lg bg-white/50 backdrop-blur-sm">
            <div className="space-y-6">
              <CameraComponent onImageCapture={handleImageCapture} />

              {isLoading && (
                <div className="flex items-center justify-center space-x-2 text-primary animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing your image...</span>
                </div>
              )}

              {currentImage && currentFact && (
                <FactCard imageUrl={currentImage} fact={currentFact} />
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <span>Recent Discoveries</span>
              <span className="text-sm font-normal text-gray-500">(Latest 5)</span>
            </h2>
            <RecentDiscoveries discoveries={discoveries} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;